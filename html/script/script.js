$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if($(e.target).text() === 'Detail') {
        var myChart = echarts.init(document.getElementById('main'));

        myChart.showLoading();
        myChart.setOption({
            title: {
                text: 'Fig-1'
            },
            tooltip: {},
            legend: {
                data:['热度']
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            dataZoom: [{   
                type: 'slider',
                start: 33,
                end: 66
            },{
                type: 'inside',
                start: 33,
                end: 66
            }],
            series: [{
                name: '热度',
                type: 'bar',
                data: []
            }]
        });

        $.post('/data').done((data) => {
            myChart.setOption({
                xAxis: {
                    data: data.categories
                },
                series: [{
                    name: '热度',
                    data: data.data
                }]
            });
        });
        myChart.hideLoading();

        myChart.on('click', (params) => {
            $('#list_title').text("话题" + params.dataIndex + ':');
            $.post('/isa', {'data': params.dataIndex}).done((data) => {
                $('#list').empty();
                $('#list').prepend('<p>' + data + '</p>');
            });
        });
    }
});

$("#news").click(() => {
    $(".tbs").empty();
    $.post('/table', '56News').done((raw) => {
        var data = raw.split(',');
        data.forEach(function(item) {
            $("#db-1").prepend(`<li><a class="db1" href="#" id="${item}" onclick="showtb('56News,' + '${item}')"><span class="glyphicon glyphicon-list-alt"> ${item}</a></li>`);
        }, this);
    });
});

$("#opin").click(() => {
    $(".tbs").empty();
    $.post('/table', 'data_opin_iic').done((raw) => {
        var data = raw.split(',');
        data.forEach(function(item) {
            $("#db-2").prepend(`<li><a class="db2" href="#" id="${item}" onclick="showtb('data_opin_iic,' + '${item}')"><span class="glyphicon glyphicon-list-alt"> ${item}</a></li>`);
        }, this);
    });
});

$("#news03").click(() => {
    $(".tbs").empty();
    $.post('/table', 'data_news_iic_03').done((raw) => {
        var data = raw.split(',');
        data.forEach(function(item) {
            $("#db-3").prepend(`<li><a class="db3" href="#" id="${item}" onclick="showtb('data_news_iic_03,' + '${item}')"><span class="glyphicon glyphicon-list-alt"> ${item}</a></li>`);
        }, this);
    });
});

$("#opin03").click(() => {
    $(".tbs").empty();
    $.post('/table', 'data_opin_iic_03').done((raw) => {
        var data = raw.split(',');
        data.forEach(function(item) {
            $("#db-4").prepend(`<li><a class="db4" href="#" id="${item}" onclick="showtb('data_opin_iic_03,' + '${item}')"><span class="glyphicon glyphicon-list-alt"> ${item}</a></li>`);
        }, this);
    });
});

function showtb(tba) {
    $("#tbm-head").empty();
    $("#tbm-body").empty();
    $.post('/teh', tba).done((data) => {
        var line = data.split(',');
        $("#tbm-head").append(`<tr id="tbm-tr-head"></tr>`);
        line.forEach(function(item) {
            $("#tbm-tr-head").append(`<th>${item}</th>`);
        }, this);
    });
    $.post('/teb', tba).done((data) => {
        var line = data.split(';');
        for(var t=0; t<line.length-1; t++) {
            $("#tbm-body").append(`<tr id="tbm-tr-${t}"></tr>`);
            var raw = line[t].split(',');
            raw.forEach(function(item) {
                $(`#tbm-tr-${t}`).append(`<td><div style="overflow:hidden; height:20px">${item}</div></td>`);
            }, this);
        }
    });
}

window.onload = () => {
    $(".container").css({"height":  window.innerHeight.toString() +"px", "max-height":  window.innerHeight.toString() +"px"});
};
