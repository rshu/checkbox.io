{NumberQuestions:true}
---------

## Overview

We're studying what web resources developers use while programming. Specifically, we're studying the urls that developers reference while programming. The study **requires no work other than uploading existing data** relevant to the study. To be eligible for this study, you must be a developer with at least `1 month of programming history` related to web development. 

## Instructions

This study should take less than 10 minutes. There are three options to upload your history:

#### 1) Chrome Extension

This option is simple and transparent, and you get to keep using a useful tool. `docsight` uses a [whitelist](https://github.com/chrisparnin/docsight/blob/master/js/filterpresets.js) approach for filtering visits to developer sites.  To filter google searches, only searches within the past 30 seconds of a developer site are included. You can add your own custom filtering:

    @include https://github.com/*/issues* 
    @exclude https://github.com/*/issues/new* 
    @exclude *://stackoverflow.com/users*

You can also check out the source code on [github](https://github.com/chrisparnin/docsight).

**Download** `docsight`: [chrome.google.com/webstore](https://chrome.google.com/webstore/detail/docsight/ceacnbgdhcnofnomlkmackaennjfmnpc?hl=en)

![Img](http://i.imgur.com/roEX4XL.png)

#### 2) SQLite Database

If you don't use Chrome or don't want to use a Chrome extension, you could also upload the history database itself.  The history database is a sqlite file, called `History` in Chrome or `places.sqlite` in Firefox.
Some locations of the history database are below:

Windows firefox users:

```none
	C:\Users\[user]\AppData\Roaming\Mozilla\Firefox\Profiles\[profile]\places.sqlite
```

Mac Chrome users:

```none
	~/Library/Application Support/Google/Chrome/Default/History
```

Windows Chrome Users:

```none
	* On XP – C:\Documents and Settings\\Local Settings\Application Data\Google\Chrome\User Data\Default\History
	* On Vista - C:\Users\\AppData\Local\Google\Chrome\User Data\Default\History
```

#### 3) SQLite Export

Finally, if you wish to instead export your data, you can use a sqlite viewer such as firefox's sqlite plugin and use a query like this to export you data.

	SELECT datetime(moz_historyvisits.visit_date/1000000,'unixepoch'), moz_places.url
	FROM moz_places, moz_historyvisits 
	WHERE moz_places.id = moz_historyvisits.place_id
			
Chrome version

	SELECT visits.visit_time, urls.url
	FROM visits, urls 
	WHERE visits.url = urls.id
	
<hr/>

## Upload

To help us understand how you use web resources for learning about programming, we've included some questions below.  Please be as detailed as you wish, we will consider every answer.

### Your history:

> {upload:true}

### Age?

> {}

### What primary languages/technologies/apis are you primarily working with?

> {rows:5}

### How long and in what context are you doing that kind of development?

> {rows:6}

### How do you search for API learning resources?

> {rows:6}


### How often do you think you use official documentation sites for API learning (percentage)?

> {rows:3}

### How often do you think you use alternative sites such as blogs or stackoverfow for API learning (percentage)?

> {rows:3}

###  What do you find lacking from official documentation sites as well as alternatives challenges?

> {rows:6}

### What improvements would help?

> {rows:6}
