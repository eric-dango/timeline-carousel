# Timeline-carousel.js
A light weight timeline based carousel with minimal function.


Usage:
------------
* Include timeline.min.js in your page. **Note:** jQuery is required before timeline.min.js

```
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="/javascripts/timeline.min.js"></script>
```

* Populate your timeline items. Make sure you have a class name for the top container. In the following case, `timeline-content` is the class for timeline.js to determine if the items placed inside should be treated as timeline. You also need to put class name `card` and data attribute `data-year` on the item container. In the following example, `<div class="card" data-year="2010" data-quarter="2">` indicates the div is one of carousel items and it is displayed for the year 2010. `data-quarter` is optional, the value of which should between 1 to 4. Timeline.js will sort the item by year and quarter.


```
<div class="timeline-content">
  <!-- item for 2010 Q2 -->
  <div class="card" data-year="2010" data-quarter="2">
    <!-- put timeline carousel item here -->
    <h2>Title here balabalal</h2>
    <h3>Subtitle here</h3>
    <div class="content">
      <img src="">
      <p>content here you can write whatever you want to display in carousel</p>
      <p>another paragraph</p>
      ....
    </div>
  </div>
  
  <!--item for 2011 Q4 -->
  <div calss="card" data-year="2011" data-quarter="4">
    <!-- put timeline carousel item here -->
    <h2>Title here balabalal</h2>
    <h3>Subtitle here</h3>
    <div class="content">
      <img src="">
      <p>content here you can write whatever you want to display in carousel</p>
      <p>another paragraph</p>
      ....
    </div>
  </div>
 </div>
 ```

* In your script tag, include the following line:
 
```
<script>
  //if(typeof TimeLine === 'function') {
    new TimeLine('.timeline-content');
  //}
</script>
```

Note: `timeline-content` comes from the class name defined in step 1

* Refresh page and see the result.

Options
------------
```
<script>
  new TimeLine({
    selector: '.timeline-content', // the container class name
    color: '#000',                 // the base color of timeline
    border: '2px'                  // border width
    height: '15px'                 // the height for timeline.
  });
</script>
```
The value of these options are set as default.

Demo: www.dangoeric.com

