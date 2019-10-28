const funcSelect2 = (el) => {
  $(el).select2({
    createTag: function(params) {
      var term = $.trim(params.term);

      if (term === "") {
        return null;
      }

      return {
        id: term,
        text: term,
        newTag: true // add additional parameters
      };
    },
    tags: true,
    tokenSeparators: [",", " "],
    placeholder: 'Tags...',
    closeOnSelect: true
  });
};
