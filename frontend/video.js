function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
} 

async function hompage_videos(){
    const requestbody = {
        query:`
        query{
      
            renderVideo {
                id
                kind
                etag
                id
                snippet{
                  title
                  description
                  channelTitle
                  thumbnails{
                    default{
                      url
                      width
                      height
                    }
                    medium{
                      url
                      width
                      height
                    }
                    high{
                      url
                      width
                      height
                    }
                    standard{
                      url
                      width
                      height
                    }
                  }
                }
                statistics{
                  viewCount
                  likeCount
                  dislikeCount
                  commentCount
                }
              }
        }    
        `
      }
    
    
      let response = await fetch('http://localhost:3000/graphql',{
        method: 'POST',
        body: JSON.stringify(requestbody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      let de = await response.json();
      const container = document.querySelector('#video_card_grid');
  removeAllChildNodes(container);
    for(let i=0;i<de.data.renderVideo.length;i++){
      load_videos(de.data.renderVideo[i].snippet.title,de.data.renderVideo[i].snippet.channelTitle,de.data.renderVideo[i].id,de.data.renderVideo[i].snippet.thumbnails.medium.url)
    }
}



function load_videos(title,channel,id,img){
  
    let live_grid = document.getElementsByClassName("video_card_grid")[0]
    let live_card = document.createElement("div");
    live_card.className ="live_card"
    live_card.onclick = function()  {
      
      window.location.href="single.php"
      // window.open("single.html", '_blank');
      single_video_page();
      localStorage.setItem('id',id)
    };

    let live_card_container = document.createElement("div");
    live_card_container.className = "live_container";
    
    var h4 = document.createElement("h4")
    var bold = document.createElement("b")
    h4.className = "live_card-title"
    bold.innerText = title
    h4.append(bold)

    var grid_div = document.createElement("div")
    grid_div.style.display = "flex"
    var p = document.createElement("p")
    p.innerText = "Channel - "+channel

    var view_btn = document.createElement("button")
    view_btn.innerText = "View"
    view_btn.style.height="40px"
    view_btn.style.width = "30%"
    view_btn.style.marginLeft = "30%"

    grid_div.append(p)
    grid_div.append(view_btn)


    var frame = document.createElement("iframe")
    var videourl = "https://www.youtube.com/embed/"+id
    frame.src = videourl;

    var thumbnail = document.createElement("img")
    thumbnail.src = img;
    thumbnail.style.width="100%"
    

    // live_card.append(frame)   //to add videos on homepage
    live_card.append(thumbnail)
    live_card_container.append(h4)
    live_card_container.append(grid_div)
    live_card.append(live_card_container)

    live_grid.appendChild(live_card)
     
}




async function single_video_page(){
  var vid = localStorage.getItem('id')
  const requestbody = {
      query:`
      query{
    
        searchVideo(searchvideoinput:{id:"${vid}"}){
          kind
          etag
          id
          snippet{
            title
            description
            channelTitle
            thumbnails{
              default{
                url
                width
                height
              }
              medium{
                url
                width
                height
              }
              high{
                url
                width
                height
              }
              standard{
                url
                width
                height
              }
              
            }
          }
          statistics{
            viewCount
            likeCount
            dislikeCount
            commentCount
          }
        }
      }    
      `
    }
  
  
    let response = await fetch('http://localhost:3000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestbody),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    let de = await response.json();

      let single_card = document.getElementsByClassName("single_video_tile")[0]
      let live_card = document.createElement("div");

      var frame = document.createElement("iframe")
      var videourl = "https://www.youtube.com/embed/"+de.data.searchVideo.id+"?autoplay=1&mute=1"
      frame.src = videourl;
      frame.id = "videoplay"
      frame.style.width = "70%"
      frame.style.height = "500px"

      var video_title = document.createElement("h1")
      video_title.innerText = de.data.searchVideo.snippet.title

      var video_desc = document.createElement("p")
      video_desc.innerText = "description: "+de.data.searchVideo.snippet.description

      var channel_title = document.createElement("p")
      channel_title.innerText = "Channel: "+de.data.searchVideo.snippet.channelTitle

      var flex_div = document.createElement("div")
      flex_div.style.display = "flex"
      flex_div.style.marginLeft = "25%"

      var view_count = document.createElement("p")
      view_count.innerText = "View: "+de.data.searchVideo.statistics.viewCount

      var like_count = document.createElement("p")
      like_count.innerText = "Likes: "+de.data.searchVideo.statistics.likeCount
      like_count.style.marginLeft = "5%"

      var dislike_count = document.createElement("p")
      dislike_count.innerText = "Dislike: "+de.data.searchVideo.statistics.dislikeCount
      dislike_count.style.marginLeft = "5%"

      var comment_count = document.createElement("p")
      comment_count.innerText = "Total Comments: "+de.data.searchVideo.statistics.commentCount
      comment_count.style.marginLeft = "5%"

      
      live_card.append(video_title)
      live_card.append(frame)
      live_card.append(channel_title)
      flex_div.append(view_count)
      flex_div.append(like_count)
      flex_div.append(dislike_count)
      flex_div.append(comment_count)
      live_card.append(flex_div)
      live_card.append(video_desc)
      single_card.appendChild(live_card)
      
}

$('#btnrefresh').click(refresh_video);

async function refresh_video(){
  const requestbody = {
    query:`
    mutation{
      fetchVideos{passed}
    }    
    `
  }


  let response = await fetch('http://localhost:3000/graphql',{
    method: 'POST',
    body: JSON.stringify(requestbody),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  let de = await response.json();
  hompage_videos()
  if(de.data.fetchVideos.passed=="Yes"){
    alert("Videos Refreshed Successfully")
  }else{
    alert("Videos Refreshed failed")
  }
}


$( document ).ready(checkcontainer);

function checkcontainer(){
  

  if($('#single_video_tile').is(':visible')){
    single_video_page();
  }else{
    hompage_videos();
  }
}