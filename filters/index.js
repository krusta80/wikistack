module.exports = function(swig) {

  var pageLink = function (page) {
    return '<a href="' + page.route + '">' + page.title + '</a>';
  };

  var tagTitle = function (tag) {
    if(tag != "") {
    	return ' Relating to '+tag;	
    }
    return "";
  };

  pageLink.safe = true;

  swig.setFilter('pageLink', pageLink);
  swig.setFilter('tagTitle', tagTitle);
};