//Create 3 columns/arrays based on the total number of images
const getColumnNumbers = function(n, total) {
  const columnNum = [];
  for(i=n; i < total; i += 3) {
    columnNum.push(i)
  }
  return columnNum;
};


function disableScroll() { 
  // Get the current page scroll position 
  scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 

      // if any scroll is attempted, set this to the previous value 
      window.onscroll = function() { 
          window.scrollTo(scrollLeft, scrollTop); 
      }; 
} 

function enableScroll() { 
  window.onscroll = function() {}; 
} 