const elasticlunr = require("elasticlunr");

module.exports = async function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("excerpt");
    this.addField("tags");
    this.setRef("id");
  });

  // loop through each post and add it to the index
  for (const post of collection) {
    let data = {};
    if (typeof post.template.read === 'function') {
      // Use the async read() method if available
      try {
        data = await post.template.read();
      } catch (e) {
        // fallback to frontMatter.data if read() fails
        data = post.template.frontMatter?.data || {};
      }
    } else {
      data = post.template.frontMatter?.data || {};
    }
    index.addDoc({
      id: post.url,
      title: data.title,
      excerpt: data.excerpt,
      tags: data.tags,
    });
  }

  return index.toJSON();
};