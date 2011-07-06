

$(document).ready(function(){
  $tweetDiv = $('<div>');
  $input = $('<input type="text" id="whichTweet" size="10" /><input type="button" id="getTweets" value="Get Tweets"/>');
  $tweetDiv.html($input);
  $('body').append($tweetDiv);
  $("#getTweets").click(getTweets);
});


function getTweets() {
  // get the user name
  $tweeter = $("#whichTweet").val();
  // block out the blanks or invalild
  if(!$tweeter) {
    return false;
  }

  query = {
    q: $tweeter
  }
  // Get em
  $tweets = $.getJSON('http://search.twitter.com/search.json?callback=?', query, function(tweets){ 
    console.debug(tweets);
    displayTweets(tweets);
  });  
}

function displayTweets(tweets) {
  if (!$('#tweetHolder').length) {
    $('body').append('<div id="tweetHolder">');
  }
  $tweetHolder = $('#tweetHolder');
  if (tweets.results && tweets.results.length) {
    $tweetHolder.html('');
     // Do our stuff.
    for(var i in tweets.results){
      $tweet = tweets.results[i];
      $timage = $tweet.profile_image_url;
      $from = $tweet.from_user;
      $text = $tweet.text;
      
      // Create paragraph
      $('<p>', {className : 'tweet'})
            .append($('<a/>', {
              href: 'http://twitter.com/' + $from,
              html: '<img src="' + $timage + '"/>'
            }))
            .append($('<span>', {
              className: 'content',
              html: '<a href="http://twitter.com/' + $from + '">@' + $from + '</a>: ' + setMentions(setHash($text))
            }))
            // Append tweet to the $tweets ul
            .appendTo($tweetHolder);
      $("#tweetHolder a").click(function(){
        return triggerTweets($(this));
      });
    }
  } else {
    $tweetHolder.html('<p>NO TWEETS FROM ' + tweets.query + '</p>');
  }
}

function setMentions(str) {
  return str.replace(/[@]+[A-Za-z0-9-_]+/ig, function(username) {
    return '<a href="http://twitter.com/'+ username.replace('@','')+'">'+username+'</a>';
  });
  console.debug($string);
};

function setHash(str) {
  return str.replace(/[#]+[A-Za-z0-9-_]+/ig, function(tag) {
    return '<a href="http://search.twitter.com/search?q='+tag.replace('#','%23') + '">'+tag+'</a>';
  });
};

function triggerTweets(linked) {
  target = linked.html().replace('[#@]', '');
  $("#whichTweet").val(target);
  getTweets();
  return false;
}