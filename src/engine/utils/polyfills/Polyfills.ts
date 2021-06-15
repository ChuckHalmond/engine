if (!Object.entries) {
    Object.entries = function(obj: object) {
      var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i); // preallocate the Array
      while (i--)
        resArray[i] = [ownProps[i], (obj as any)[ownProps[i]]];
  
      return resArray;
    };
}