{
	NumberQuestions: true
}
-----------------------

We are designing research tools about reviewing, sharing, and summarizing programming tasks.  These tools will help you multi-task, hand-off tasks to other teammates, recover from an interruption, or simply help you remember how to perform a similar task in the future. By answering these questions, you will aid the design of the tools and help us prioritize feature development. Please be as detailed as you wish, we will consider every answer.

### How often do wish to revisit a completed programming task?
For example, recall how to add a column to a grid using the ExtJS javascript framework from a task you did last week?

1. Everyday
2. Once a week
3. Once a month
4. Rarely

### What strategies do you use to recall a completed programming task?  What is painful about this process?

> {rows: 4}

### How often do want to share an experience or asked by another developer how to do a task you have done before?

1. Everyday
2. Once a week
3. Once a month
4. Rarely

### What strategies do you use to share an experience with another developer?  What is painful about this process?

> {rows: 4}

### If you could review your personal history of development in a *timeline*, which elements would you want to be able to review?

*An example code snippet recently viewed:*<br/>
<!-- change -->
![Img](http://i.imgur.com/DZR9CJ5.png)

|                       | Do not Want | Sometimes | Always |
| --------------------- | ----------- | --------- | ------ | 
| Code that did not work out and was deleted.     |  |  |  |
| Time spent on particular edits	               |  |  |  |
| Search terms used in IDE	                       |  |  |  |
| Summary of code snippets viewed	               |  |  |  |
| Summary of code and files edited	               |  |  |  |

### Would you also include these items in a personal history review?

*An example of developer-related history.* 
<!-- doc sight -->
![Img](http://i.imgur.com/ruHDk2J.png)

*An example of a recent exception encountered while coding.* 
<!-- exception -->
![Img](http://i.imgur.com/vfelrcA.png)

|                       | Do not Want | Sometimes | Always |
| --------------------- | ----------- | --------- | ------ | 
| Documentation, blog posts, Stack Overflow questions referenced|  |  |  |
| Google search queries	                          |  |  |  |
| Runtime exceptions experienced when debugging |  |  |  |
| Provenance (origin) of copied and pasted code.  |  |  |  |


### If you were to share the history of your programming tasks with a teammate or even publically, how comfortable would you be with sharing the following:

|                       | Do not Share | Share if Anonymous | Share |
| --------------------- | ------------ | ------------------ | ----- | 
| Code that did not work out and was deleted.     |  |  |  |
| Time spent on particular edits	              |  |  |  |
| Search terms used in IDE	                      |  |  |  |
| Summary of code snippets viewed	               |  |  |  |
| Summary of code and files edited	               |  |  |  |

### How would you feel about sharing these?
|                       | Do not Share | Share if Anonymous | Share |
| --------------------- | ------------ | ------------------ | ----- | 
| Documentation, blog posts, Stack Overflow questions referenced	|  |  |  |
| Google search queries	                          |  |  |  |
| Runtime exceptions experienced when debugging	  |  |  |  |
| Provenance (origin) of copied and pasted code.  |  |  |  |


### What are some general concerns about sharing programming activity?

> {rows: 5}

### What are the best ways to alleviate those concerns (if any)?

> {rows: 3}

## Design

Please help us the design of a tool for automatically creating a blog post about a recent programming task.

### Which would you prefer?

**Please consider the two user interface designs below before providing your answer:**

1. A text-only markdown-based format for editing a blog post.

2. A rich editor with drag and drop support, collapsible sections, links to code elements in the IDE, etc.

3. Both

#### Edit a generated markdown file, or

```none
# A auto-generated blog post
This is an semi-automatically generated blog post created with the aid of some research tools I'm in the process of developing!

First, I'll show you screenshots, how this post got here, and then use it to illustrate a recent coding task involving programatically "publishing" a blog post from C# code.

## Auto-generating code snippets in Visual Studio
...
## Sample Coding Task - Programmatically publishing a blog post in C#
Next, I create some simple data structures for the published blog post and site.

    public class BlogPost
    {
        public string Title {get;set; }
        public DateTime DateTime {get;set;}
        public List<string> Entries {get;set; }
    }

    public class BlogSite
    {
        public string Url = "http://blog.ninlabs.com";
        public string User = "****";
        public string Password = "****";
    }
```

#### A rich editor with drag and drop support, collapsible sections, links to code elements in the IDE, etc.

![Img](http://blog.ninlabs.com/wp-content/uploads/2011/11/overall.png)

<br/>

### Why?

> {rows: 3}

### How much time would you invest in tweaking the automatically blog post?

1. None
2. 15 minutes
3. 30 minutes
4. 1 hour
5. As long as it takes to make it perfect

### What sort of details would you focus on including and improving?

> {rows:3}

### What other information would you want included (even if you don't think it possible)?

> {rows:3}


### Bonus: What is your biggest pain point related to this topic, or other feedback?

> {rows:6}
