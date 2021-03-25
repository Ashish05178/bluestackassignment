const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fetch = require("node-fetch");
const mongoose = require('mongoose');

let User = require('./models/login');
let Video = require('./models/video');
const { response } = require('express');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
})


app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`

        type Login {
          email:String,
          password:String,
        }

        type thumbnailsizeSchema{
          url:String,
          width:String,
          height:String,
        }

        type thumbnailSchema{
          default:thumbnailsizeSchema,
          medium:thumbnailsizeSchema,
          high:thumbnailsizeSchema,
          standard:thumbnailsizeSchema,
          maxers:thumbnailsizeSchema,
        }

        type snippetSchema{
          title:String,
          description:String,
          thumbnails:thumbnailSchema,
          channelTitle:String,
        }

        type statisticSchema{
          viewCount:String,
          likeCount:String,
          dislikeCount:String,
          commentCount:String,
        }

        type Video {
          passed:String,
          kind:String,
          etag:String,
          id:String,
          snippet:snippetSchema,
          statistics:statisticSchema,
        }

        input Logininput {
          email:String!,
          password:String!,
        }
   
   
        input Searchvideoinput {
          id:String!,
        }


        type RootQuery {
            login(logininput: Logininput) : Login,
            searchVideo(searchvideoinput: Searchvideoinput) : Video,
            renderVideo :[Video],
        }
        type RootMutation {
            fetchVideos : Video,
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
     
      searchVideo: (args) => {
        return Video.findOne({ id: args.searchvideoinput.id })
          .then(searchvideo => {
            if (searchvideo) {

              return { ...searchvideo._doc }

            } else {
              throw new Error("Video not Exists");
            }
          })
      },

      renderVideo: () => {

        return Video.find().then(video =>{
          if(video){
            return video.map(vid => {

              return {
                ...vid._doc
              }
            })
          }
        
        })

      },

      async fetchVideos() {
        key = "";
        url = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=200&regionCode=IN&key=" + key;
        let response = await fetch(url);
        let videodata = await response.json()
        let dbdata = [];


        for (let y = 0; y < videodata.items.length; y++) {
          item = videodata.items[y]
          await Video.findOne({
            id: item.id,
          }).then(videodetails => {
            if (videodetails) {
              Video.updateOne(
                { id: item.id, },
                {
                  "$set": {
                    kind: item.kind,
                    etag: item.etag,
                    id: item.id,
                    snippet: {
                      title: item.snippet.title,
                      description: item.snippet.description,
                      thumbnails: {
                        default: {
                          url: item.snippet.thumbnails.default.url,
                          width: item.snippet.thumbnails.default.width,
                          height: item.snippet.thumbnails.default.height,
                        },
                        medium: {
                          url: item.snippet.thumbnails.medium.url,
                          width: item.snippet.thumbnails.medium.width,
                          height: item.snippet.thumbnails.medium.height,
                        },
                        high: {
                          url: item.snippet.thumbnails.high.url,
                          width: item.snippet.thumbnails.high.width,
                          height: item.snippet.thumbnails.high.height,
                        },
                        standard: {
                          url: item.snippet.thumbnails.standard.url,
                          width: item.snippet.thumbnails.standard.width,
                          height: item.snippet.thumbnails.standard.height,
                        },
                        maxres: {
                          url: '',
                          width: '',
                          height: '',
                        },
                      },
                      channelTitle: item.snippet.channelTitle,
                    },
                    statistics: {
                      viewCount: item.statistics.viewCount,
                      likeCount: item.statistics.likeCount,
                      dislikeCount: item.statistics.dislikeCount,
                      commentCount: item.statistics.commentCount,
                    }
                  }
                },
                { "new": true }
              )
            } else {
              
       
              let videodat = new Video({
                kind: item.kind,
                etag: item.etag,
                id: item.id,
                snippet: {
                  title: item.snippet.title,
                  description: item.snippet.description,
                  thumbnails: {
                    default: {
                      url: item.snippet.thumbnails.default.url,
                      width: item.snippet.thumbnails.default.width,
                      height: item.snippet.thumbnails.default.height,
                    },
                    medium: {
                      url: item.snippet.thumbnails.medium.url,
                      width: item.snippet.thumbnails.medium.width,
                      height: item.snippet.thumbnails.medium.height,
                    },
                    high: {
                      url: item.snippet.thumbnails.high.url,
                      width: item.snippet.thumbnails.high.width,
                      height: item.snippet.thumbnails.high.height,
                    },
                    standard: {
                      url: item.snippet.thumbnails.standard.url,
                      width: item.snippet.thumbnails.standard.width,
                      height: item.snippet.thumbnails.standard.height,
                    },
                    maxres: {
                      url: '',
                      width: '',
                      height: '',
                    },
                  },
                  channelTitle: item.snippet.channelTitle,
                },
                statistics: {
                  viewCount: item.statistics.viewCount,
                  likeCount: item.statistics.likeCount,
                  dislikeCount: item.statistics.dislikeCount,
                  commentCount: item.statistics.commentCount,
                }
              })
              dbdata.push(videodat);
              videodat.save();

            }

          })

        }
        return { passed: "Yes" };
      },

      login: (args) => {
        return User.findOne({
          email: args.logininput.email,
          password: args.logininput.password
        })
          .then(user => {
            if (user) {

              return {
                ...user._doc
              }
            } else {
              throw new Error("User not Exists")
            }
          })
      },


    },
    graphiql: true
  })
);

mongoose.connect('mongodb://localhost/bluestack').then(() => {
  app.listen(3000, () => {
    console.log("Listening at : 3000....")
  });
}).catch(err => {
  console.log(err);
})
