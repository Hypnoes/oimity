$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if($(e.target).text() === 'tab-2') {
        var myChart = echarts.init(document.getElementById('main'));

        myChart.showLoading();
        myChart.setOption({
            title: {
                text: 'Data_News_iio_03'
            },
            tooltip: {},
            legend: {
                data:['PageNum']
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
                name: 'Num',
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
                    name: 'Num',
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
