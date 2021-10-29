# Search the IPL

Problem Statement

> Create a discovery page for IPL where users can search & use facet
> filters to find different entities – players, teams, owners & venues.
> Users should be able to filter based on any attributes related to the
> entity. Make it as easy, intuitive and as less steps as possible for
> the user to reach a particular entity.

## Additional feature:

1. clicking on a team leads to the matches played by that team
2. clicking on the venue leads to the matches played at that venue

The app is hosted at : https://ipl-dashboard.netlify.app/

## Page Load Time

The Page Load time was calculated using lighthouse in the developer tools of google chrome.
The page load time to interactive compare as follows:
| Page|Before Optimzations|After Optimizations |
|--|--|--|
| Teams Page | 1.0s | 0.7s |
| Players Page | 1.2s | 0.9s |
| Venues Page | 1.3s | 0.9s |
| Matches Page | 1.3s | 0.9s |

The Optimization techniques used were:

1.  introduce lazy loading of records using infinite scrolling tables
2.  reduce image sizes
3.  Add keys to the recurring element to avoid unnecessary rerendering
4.  reducing number of dom nodes.

After Optimizing, [dot-com-tools.com](https://www.dotcom-tools.com/website-speed-test.aspx) gave the following results for the page load time from 21 locations around the globe:

![](screenshots/load-times.png)

The bundle size was found to be **373 KB**

# Screenshots

## teams page

![](screenshots/ss1.png)

## players page

![](screenshots/ss2.png)

## matches page

![](screenshots/ss3.png)

## venues page

![](screenshots/ss4.png)

## filters

![](screenshots/ss5.png)
![](screenshots/ss6.png)
![](screenshots/ss7.png)

## filtered results

![](screenshots/ss8.png)
