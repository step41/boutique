Here is a simple jQuery plugin to make a table header fixed on top of a div when this is scrolled.
Using the code from twitter bootstrap documentation page, this code is customized for table header.

Create the table with the table-fixed-header class and a thead tag:
<table class="table table-striped table-fixed-header" id="mytable">
  <thead class="header">
    <tr>
      <th>Email Address</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Administrator</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>admin@fakeadress.com</td>
      <td>firstname</td>
      <td>LastName</td>
      <td>Data Column 4</td>
    </tr>
    ...
  </tbody>
</table>

Add the css from the file "table-fixed-header.css" You need to assign a height value to 
".table-content" into the css.

To apply it to above table, call the following:
$(document).ready(function(){
  $('.table-fixed-header').prepFixedHeader().fixedHeader();
});

To avoid prepFixedHeader, wrap the table with <div class="row fixed-table"><div class="table-content">...
</div></div> ahead of time. 

If you have images in your table, running fixedHeader() on document.ready may cause layout problems,
since the layout may change once images are loaded. In that case, call fixedHeader() on document.load:

$(document).ready(function(){
  $('.table-fixed-header').prepFixedHeader();
});
$(document).load(function(){
  $('.table-fixed-header').fixedHeader();
});
