$(document).ready(function() {
  
  //connects to app.js so we 
  var socket = io();
        
  //variables for information
  var jsonTemp,
  timeCheck = new Date(),
  isH = false,
  isF = true,
  isChart = false,
  graphFData = [],
  graphCData = [],
  graphHData = [],
  tempData = [];
  
  //listening for info and updating when info is received
  socket.on('data', function(data) {
    //parses string to JSON object
    var currentTime = new Date;
    jsonTemp = JSON.parse(data);
    jsonTemp.date = currentTime;

    //saves the data into arrays for history chart
    if (jsonTemp.date.getMinutes() != timeCheck.getMinutes()) {
      tempData.push(jsonTemp);
      graphFData.push([jsonTemp.date.getTime(), jsonTemp.f]);
      graphCData.push([jsonTemp.date.getTime(), jsonTemp.c]);
      graphHData.push([jsonTemp.date.getTime(), jsonTemp.humidity]);
      console.log("Saved time for the minute.")
      timeCheck = new Date();
    }
    //logs data to ensure it was received
    //console.log(jsonTemp);

    //updates html with info
    $("#h").text(jsonTemp.humidity + "%");
    if(isF) {
      $("#temp").text(jsonTemp.f + "\u00B0");
    } else {
      $("#temp").text(jsonTemp.c + "\u00B0");
    }
    $("#time").text(getTrueTime());
  });

  //gets time for the website into easy to read format
  function getTrueTime() {
    var t = new Date();
    if (t.getHours() > 12) {
      return (t.getHours() - 12) + ":" + t.getMinutes().toString().padStart(2, '0') + "pm";
    } else {
      return t.getHours() + ":" + t.getMinutes() + "am";
    }
  }

  //makes the history charts when button is pressed
  function makeChart() {
    //checks what chart to make and fills in appropriate areas (humidity vs temp)
    var data, line, title, axisTitle;
    if (isH) {
      data = graphHData;
      line = "Humidity";
      title = "Previous Humidity";
      axisTitle = "Humidity %"
    } else if (isF) {
      data = graphFData;
      line = "Fahrenheit";
      title = "Previous Temperature";
      axisTitle = "Temperature in F\u00B0"
    } else {
      data = graphCData;
      line = "Celcius";
      title = "Previous Temperature";
      axisTitle = "Temperature in C\u00B0"
    }

    //creates chart through highcharts
    Highcharts.chart('histBox', {
      chart: {
        type: 'spline'
      },
      title: {
        text: title
      },
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value: %H:%M}'
        }
      },
      yAxis: {
        title: axisTitle,
      },
      series: [{
        marker: {
          symbol: "square",
        },
        name: line,
        data: data
      }]
    })
  }

  //used to show the temp chart
  function showTempChart() {
    if (!isChart) {
      makeChart();
      $("#histBox").css("display", "block");
      isChart = true;
      $("#tempHistBut").text("Close");
      $("#humidHistBut").css("display", "none");
      $("#updateBut").css("display", "inline");
    } else {
      $("#histBox").css("display", "none");
      isChart = false;
      $("#tempHistBut").text("Show Temperature History");
      $("#humidHistBut").css("display", "inline");
      $("#updateBut").css("display", "none");
    }
  }

  //used to show the humidity chart
  function showHumidChart() {
    if (!isChart) {
      isH = true;
      makeChart();
      $("#histBox").css("display", "block");
      isChart = true;
      $("#humidHistBut").text("Close");
      $("#tempHistBut").css("display", "none");
      $("#updateBut").css("display", "inline");
    } else {
      isH = false;
      $("#histBox").css("display", "none");
      isChart = false;
      $("#humidHistBut").text("Show Humidity History");
      $("#tempHistBut").css("display", "inline");
      $("#updateBut").css("display", "none");
    }
  }

  $("#tempHistBut").click(showTempChart);
  $("#humidHistBut").click(showHumidChart);
  $("#updateBut").click(makeChart);


  $("#tempTypeBut").click(function() {
    isF = !(isF);
    if (isChart && !isH) {
      makeChart();
    }
    if(isF) {
      $("#temp").text(jsonTemp.f + "\u00B0");
      $("#tempName").text("Fahrenheit");
      $("#tempTypeBut").text("C\u00B0");
    } else {
      $("#temp").text(jsonTemp.c + "\u00B0");
      $("#tempName").text("Celcius");
      $("#tempTypeBut").text("F\u00B0");
    }
  })

});
