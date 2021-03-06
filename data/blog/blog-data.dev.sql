INSERT INTO blog_author(id, first_name, last_name) VALUES ('I20ITR', 'Matthew', 'Maxwell');

INSERT INTO blog_post_status(id, status) VALUES ('Q71ED1', 'DRAFT');
INSERT INTO blog_post_status(id, status) VALUES ('VKVOPU', 'PUBLISHED');
INSERT INTO blog_post_status(id, status) VALUES ('G012UH', 'ARCHIVED');

INSERT INTO blog_topic(id, name, description) VALUES ('97TGIW', 'Audio Development', 'Any and all things related to audio development and audio programming.');
INSERT INTO blog_topic(id, name, description) VALUES ('O2VDYD', 'Game Development', 'Any and all things related to game development.');
INSERT INTO blog_topic(id, name, description) VALUES ('IJB0N0', 'Digital Signal Processing', 'Any and all things related to digital signal processing.');
INSERT INTO blog_topic(id, name, description) VALUES ('ECD925', 'Software Architecture', 'Any and all things related to software architecture.');
INSERT INTO blog_topic(id, name, description) VALUES ('7Q7QR4', 'Software Design', 'Any and all things related to software design.');
INSERT INTO blog_topic(id, name, description) VALUES ('AB6X6R', 'Software Engineering', 'Any and all things related to software engineering.');

-- CAUTION: The following data is starter data - NOT intended for production
INSERT INTO blog_post(id, author_id, status_id, title, subtitle, preview, content, image_url)
VALUES ('4T1VVA',
        'I20ITR',
       'VKVOPU',
       'The Constraints of Audio Programming',
       'Restrictions of the digital audio domain',
       'Programming for audio software is such a fascinating problem domain and requires some interesting ways of thinking to write optimal code.',
        '# TITLE

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus urna neque viverra justo nec ultrices. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Libero enim sed faucibus turpis in eu mi bibendum neque. Id aliquet risus feugiat in. Tortor at auctor urna nunc id. Eu turpis egestas pretium aenean. Suspendisse sed nisi lacus sed viverra tellus in. Quis commodo odio aenean sed. Non arcu risus quis varius quam quisque id diam vel.

<br>

```typescript
ngOnInit(): void {
    this.isAdmin = this.authService.isLoggedIn();

    this.apiService.getPost(this.router.url).subscribe(post => {
        if(post.status.status !== ''PUBLISHED'' && !this.isAdmin) {
            this.notificationService.createNotification(''Unable to view the blog post.'');
            this.router.navigate(['''']);
        }

        this.post = post;
        this.post.topics.sort(this.comparisonService.topics);

        this.isLoaded = true;
    }, (error: HttpErrorResponse) => {
        this.notificationService.createNotification(error.error.message);
    });
}
```

<br>

Sed adipiscing diam donec adipiscing tristique. Interdum velit euismod in pellentesque massa. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum. Mattis molestie a iaculis at. Amet porttitor eget dolor morbi non. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Ut morbi tincidunt augue interdum velit. Vel quam elementum pulvinar etiam non quam. Vulputate odio ut enim blandit volutpat maecenas volutpat. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Convallis posuere morbi leo urna molestie at elementum eu. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
       'images/portfolio/projects/rotor.png');

INSERT INTO blog_post(id, author_id, status_id, title, subtitle, preview, content, image_url)
VALUES ('0F2P52',
        'I20ITR',
       'VKVOPU',
       'Making a Game for the 2019 Global Game Jam',
       'No sleep, only game development',
       'Making a game for a game jam is quite an intense experience, but is beyond rewarding if you''re willing to learn new skills or hone some old ones.',
        '# TITLE

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus urna neque viverra justo nec ultrices. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Libero enim sed faucibus turpis in eu mi bibendum neque. Id aliquet risus feugiat in. Tortor at auctor urna nunc id. Eu turpis egestas pretium aenean. Suspendisse sed nisi lacus sed viverra tellus in. Quis commodo odio aenean sed. Non arcu risus quis varius quam quisque id diam vel.

<br>

```typescript
ngOnInit(): void {
    this.isAdmin = this.authService.isLoggedIn();

    this.apiService.getPost(this.router.url).subscribe(post => {
        if(post.status.status !== ''PUBLISHED'' && !this.isAdmin) {
            this.notificationService.createNotification(''Unable to view the blog post.'');
            this.router.navigate(['''']);
        }

        this.post = post;
        this.post.topics.sort(this.comparisonService.topics);

        this.isLoaded = true;
    }, (error: HttpErrorResponse) => {
        this.notificationService.createNotification(error.error.message);
    });
}
```

<br>

Sed adipiscing diam donec adipiscing tristique. Interdum velit euismod in pellentesque massa. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum. Mattis molestie a iaculis at. Amet porttitor eget dolor morbi non. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Ut morbi tincidunt augue interdum velit. Vel quam elementum pulvinar etiam non quam. Vulputate odio ut enim blandit volutpat maecenas volutpat. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Convallis posuere morbi leo urna molestie at elementum eu. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
       'images/portfolio/projects/operation-home.png');

INSERT INTO blog_post(id, author_id, status_id, title, subtitle, preview, content, image_url)
VALUES ('7SN0F3',
        'I20ITR',
       'Q71ED1',
       'My First Internship Experience',
       'Navigating a new tech environment in Japanese',
       'This post is going to be about going through my first internship experience and the things I learned throughout the process.',
        '# TITLE

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus urna neque viverra justo nec ultrices. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Libero enim sed faucibus turpis in eu mi bibendum neque. Id aliquet risus feugiat in. Tortor at auctor urna nunc id. Eu turpis egestas pretium aenean. Suspendisse sed nisi lacus sed viverra tellus in. Quis commodo odio aenean sed. Non arcu risus quis varius quam quisque id diam vel.

<br>

```typescript
ngOnInit(): void {
    this.isAdmin = this.authService.isLoggedIn();

    this.apiService.getPost(this.router.url).subscribe(post => {
        if(post.status.status !== ''PUBLISHED'' && !this.isAdmin) {
            this.notificationService.createNotification(''Unable to view the blog post.'');
            this.router.navigate(['''']);
        }

        this.post = post;
        this.post.topics.sort(this.comparisonService.topics);

        this.isLoaded = true;
    }, (error: HttpErrorResponse) => {
        this.notificationService.createNotification(error.error.message);
    });
}
```

<br>

Sed adipiscing diam donec adipiscing tristique. Interdum velit euismod in pellentesque massa. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat in. Posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum. Mattis molestie a iaculis at. Amet porttitor eget dolor morbi non. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Ut morbi tincidunt augue interdum velit. Vel quam elementum pulvinar etiam non quam. Vulputate odio ut enim blandit volutpat maecenas volutpat. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Convallis posuere morbi leo urna molestie at elementum eu. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.',
       'images/portfolio/projects/green-foot.png');

INSERT INTO blog_post_topics_blog_topic(blog_post_id, blog_topic_id) VALUES ('4T1VVA', '97TGIW'), ('4T1VVA', 'IJB0N0');
INSERT INTO blog_post_topics_blog_topic(blog_post_id, blog_topic_id) VALUES ('0F2P52', 'O2VDYD'), ('0F2P52', '97TGIW');
INSERT INTO blog_post_topics_blog_topic(blog_post_id, blog_topic_id) VALUES ('7SN0F3', 'AB6X6R'), ('7SN0F3', '7Q7QR4');
