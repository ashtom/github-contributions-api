import cheerio from 'cheerio'
import fetch from 'node-fetch'
import _ from 'lodash'

async function fetchYears(username) {
  const data = await fetch(`https://github.com/${username}`);
  const $ = cheerio.load(await data.text());
  return $(".js-year-link")
    .get()
    .filter(a => {
      const $a = $(a);
      const year = parseInt($a.text().trim(), 10);
      return (year > 2018 ? true : false);
    })
    .map(a => {
      const $a = $(a);
      return {
        href: $a.attr("href"),
        text: $a.text().trim()
      };
    });
}

async function fetchDataForYear(url, year, format) {
  const data = await fetch(`https://github.com${url}`);
  const $ = cheerio.load(await data.text());
  const $days = $("g rect.ContributionCalendar-day");
  const contribText = $(".js-yearly-contributions h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);
  let contribCount;
  if (contribText) {
    [contribCount] = contribText;
    contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
  }

  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr("data-date"),
      end: $($days.get($days.length - 1)).attr("data-date")
    },
    contributions: (() => {
      const parseDay = day => {
        const $day = $(day);
        var date;
        if ($day.attr("data-date") === undefined) {
          date = [0, 0, 0]
        } else {
          date = $day
            .attr("data-date")
            .split("-")
            .map(d => parseInt(d, 10));
        }
        const value = {
          date: $day.attr("data-date"),
          count: parseInt($day.attr("data-count"), 10),
          intensity: parseInt($day.attr("data-level"), 10)
        };
        return { date, value };
      };

      if (format !== "nested") {
        return $days.get().map(day => parseDay(day).value);
      }

      return $days.get().reduce((o, day) => {
        const { date, value } = parseDay(day);
        const [y, m, d] = date;
        if (!o[y]) o[y] = {};
        if (!o[y][m]) o[y][m] = {};
        o[y][m][d] = value;
        return o;
      }, {});
    })()
  };
}

export async function fetchDataForLastYear(username, format) {
  return Promise.all(
    [ fetchDataForYear(`/${username}`, "last", format) ]
  ).then(resp => {
    return {
      years: (() => {
        const obj = {};
        const arr = resp.map(year => {
          const { contributions, ...rest } = year;
          _.setWith(obj, [rest.year], rest, Object);
          return rest;
        });
        return format === "nested" ? obj : arr;
      })(),
      contributions:
        format === "nested"
          ? resp.reduce((acc, curr) => _.merge(acc, curr.contributions))
          : resp
              .reduce((list, curr) => [...list, ...curr.contributions], [])
              .sort((a, b) => {
                if (a.date < b.date) return 1;
                else if (a.date > b.date) return -1;
                return 0;
              })
    };
  });
}