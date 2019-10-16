module.exports = function createStaticJsonContent(routeName) {
  const staticApiContent =
`{
  "${routeName}": [
    {
      "id": 1,
      "name": "First ${routeName}",
      "integer": 101,
      "boolean": true,
      "long_text": "Chuck Norris can slam a revolving door. Chuck Norris is the reason why Waldo is hiding. Chuck Norris can lead a horse to water AND make it drink. Chuck Norris doesn't flush his toilet; he scares the shit out of it.",
      "image_url": "https://www.dogideas.net/wp-content/uploads/West-Highland-White-Terrier-Westie-Dogs.jpg",
      "date": "2018-03-18T02:14:00.000Z",
      "null": null
    },
    {
      "id": 2,
      "name": "Second ${routeName}",
      "integer": 102,
      "boolean": false,
      "long_text": "Outer space exists because it's afraid to be on the same planet with Chuck Norris. Chuck Norris does not get frostbite; Chuck Norris bites frost. Chuck Norris doesn't wear a watch; HE decides what time it is.",
      "image_url": "https://d32l83enj9u8rg.cloudfront.net/wp-content/uploads/golden-doodle-620-403-1.jpg",
      "date": "2019-06-15T11:47:00.000Z",
      "null": null
    },
    {
      "id": 3,
      "name": "Third ${routeName}",
      "integer": 103,
      "boolean": true,
      "long_text": "When the Boogeyman goes to sleep every night, he checks his closet for Chuck Norris. Chuck Norris' sleep number is roundhouse. The Great Wall of China was originally created to keep Chuck Norris out.",
      "image_url": "https://cf.ltkcdn.net/dogs/images/std/237577-675x450-Cavachon-Puppy.jpg",
      "date": "2018-10-09T06:33:00.000Z",
      "null": null
    }
  ]
}
`
  return staticApiContent;
}