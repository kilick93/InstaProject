exports.TagsForLikes = function(img) {
  var Img = [];
  Img.push(img.id);
  Img.push(img.likes);
  Img.push(img.tags);

  return Img;
}
