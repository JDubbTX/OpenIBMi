const elasticlunr = require("elasticlunr");

module.exports = function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("excerpt");
    this.addField("tags");
    this.setRef("id");
  });

  // loop through each post and add it to the index
  collection.forEach((post) => {
    index.addDoc({
      id: post.url,
      title: post.template.frontMatter.data.title,
      excerpt: post.template.frontMatter.data.excerpt,
      tags: post.template.frontMatter.data.tags,
    });
  });

  return index.toJSON();
};