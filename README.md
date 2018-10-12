ComicBin
=============

### Web UI for ComicRack

- Browse and search by Series.
- Browse Series by Publisher.

### Reading Features:

- Dual or Single page views
- Auto two page layout detection
- Optional Manga right to left Direction
- Elementary swipe support for next page turns
- Metadata viewing - partial

### Not complete

- User login/logout
- Save reading progress
- smart list viewing
- recently added list
- Quantity stats.


So why do another web reader?
I have a comicrack library built with a database containing tons of great metadata. 
What if I want a web reader to browse all this? Well there are a few. All of them make their own database and none of them use comicrack's db. they either get the info out of the comic file or rescrape comicvine. 
Browsing is typically done by folder structure.
Reading is always a single page.
I wanted something that is dual page and browsable by different options.

Using ComicBin:
comicrack plugin:
https://github.com/Timmy-B/ComicRackWeb

run
> npm install
> npm run build

the contains of the dist folder must be copied into the tablet folder of the comicrack plugin

## Screenshots

#### Publishers Browser
![Publishers Browser](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/publishers.png)
#### Series Browser
![Series Browser](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/series.png)
#### Search
![Search](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/search.png)
#### Read Progress
![Read Progress](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/readprogress.png)
#### Cover View
![Cover View](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/cover.png)
#### 2 Page View
![2 Page View](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/2page.jpg)
#### Synopsis and Options Panel
![2 Page View](https://raw.githubusercontent.com/Timmy-B/ComicBin/master/examples/infopanel.png)
