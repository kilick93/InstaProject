var Tags; // tags / counter / likes

function TagsForLikes(img) {
  var Img = [];
  Img.push(img.id);
  Img.push(img.likes);
  Img.push(img.tags);

  return Img;
}

exports.getMedia = function(medias) {
  var Medias = [];
  medias.forEach(function(img, index) {
    Medias.push(TagsForLikes(img));
  });
  Tags = [];
  LikesperTags(Medias);
  writeArrayToFile(Tags);
  return Medias;
}

function LikesperTags(Medias) {
  Medias.forEach(function(img, index) {
    img[2].forEach(function(tag, index) {
      // Si le tag n'est pas déjà enregistré
      // console.log('Tags : ' + Tags);
      // console.log('tag : ' + tag);
      var index = getArrayColumnIndex(Tags, 0, tag);
      if (index < 0) {
        var Tag = [];
        Tag.push(tag);
        Tag.push(1);
        // console.log(img[1].count);
        Tag.push(img[1].count);
        Tag.push(Tag[2]/Tag[1]);
        Tags.push(Tag);
      }
      else {
        Tags[index][1]++;
        Tags[index][2] +=img[1].count;
        Tags[index][3] = Tags[index][2] / Tags[index][1];
      }
    })
  })
}

function getArrayColumnIndex(arr, col, a) {
  return  arr.map(obj => obj[col]).indexOf(a);
}
function writeArrayToFile(arr) {
  var fs = require('fs');

  var file = fs.createWriteStream('array.txt');
  file.on('error', function(err) { /* error handling */ });
  arr.forEach(function(v) { file.write(v.join(', ') + '\n'); });
  file.end();

}
