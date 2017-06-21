import React, { Component } from 'react';

import { Table, DatePicker, Button, Input, Radio } from 'antd';
import Station from '../../components/Station';
import TicketsModel from '../../model/tickets.js';
import moment from 'moment';
import './index.scss';

const RadioGroup = Radio.Group;

const columns = [
    { title: '车次', dataIndex: 'station_train_code', key: 'station_train_code' },
    {
        title: '出发站/到达站', dataIndex: 'station', key: 'station', render: (text, row) => {
            return (
                <div>
                    <div>{row.from_station_name}</div>
                    <div>{row.to_station_name}</div>
                </div>);
        }
    },
    {
        title: '出发时间/到达时间', dataIndex: 'time', key: 'time', render: (text, row) => {
            return (
                <div>
                    <div>{row.start_time}</div>
                    <div>{row.arrive_time}</div>
                </div>);
        }
    },
    { title: '历时', dataIndex: 'lishi', key: 'lishi' },
    { title: '商务座', dataIndex: 'swz_num', key: 'swz_num' },
    { title: '特等座', dataIndex: 'tz_num', key: 'tz_num' },
    { title: '一等座', dataIndex: 'zy_num', key: 'zy_num' },
    { title: '二等座', dataIndex: 'ze_num', key: 'ze_num' },
    { title: '软卧', dataIndex: 'gr_num', key: 'gr_num' },
    { title: '硬卧', dataIndex: 'yw_num', key: 'yw_num' },
    { title: '软座', dataIndex: 'rz_num', key: 'rz_num' },
    { title: '硬座', dataIndex: 'yz_num', key: 'yz_num' },
    { title: '无座', dataIndex: 'wz_num', key: 'wz_num' },
    { title: '其他', dataIndex: 'qt_num', key: 'qt_num' },
    { title: '备注', dataIndex: 'name', key: 'name' },
];

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            dataSource: null,
            startValue: moment().day(1),
            endValue: moment().day(30),
            endOpen: false,
            purposeCode: 'ADULT',
            fromStation: [],
            toStation: []
        };
        // this.getTickets();
        this.getStation();
        this.stationData = [];
        this.fromStatonCode = 'GZQ';
        this.toStatonCode = 'NNZ';
    }

    disabledStartDate(startValue) {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate(endValue) {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onStartChange(value) {
        this.onChange('startValue', value);
    }

    onEndChange(value) {
        this.onChange('endValue', value);
    }

    handleStartOpenChange(open) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange(open) {
        this.setState({ endOpen: open });
    }
    purposeChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            purposeCode: e.target.value,
        });
    }
    getTickets() {
        let params = {
            train_date: moment(this.state.startValue).format('YYYY-MM-DD'),
            from_station: this.fromStatonCode,
            to_station: this.toStatonCode,
            purpose_codes: this.state.purposeCode
        }
        TicketsModel.getTickets(params).then((xhr, data) => {
            let ticketInfo = data.map((record, key) => {
                record.queryLeftNewDTO.key = key;
                return record.queryLeftNewDTO
            })
            this.setState({
                dataSource: ticketInfo
            })
        }).catch((e, xhr, response) => {
            // consloe.log(response)
        })
    }
    getFromStationCode(val) {
        this.fromStatonCode = val
    }
    getToStationCode(val) {
        this.toStatonCode = val
    }
    getStation() {
        TicketsModel.getStation().then((xhr, data) => {

            let stationData = [];
            let limitSationData = [];
            data.split('@').map((record, key) => {
                if (record) {
                    let recordArr = record.split('|');
                    stationData.push({
                        key: recordArr[0],
                        name: recordArr[1],
                        nameCode: recordArr[2],
                        searchText: recordArr[1] + recordArr[3] + recordArr[4]
                    });
                    if (key < 10) {
                        limitSationData.push({
                            key: recordArr[0],
                            name: recordArr[1],
                            nameCode: recordArr[2],
                            searchText: recordArr[1] + recordArr[3] + recordArr[4]
                        });
                    }
                }

            });
            this.stationData = stationData;

            this.setState({
                fromStation: limitSationData,
                toStation: limitSationData
            });

        }).catch((e, xhr, response) => {
            console.log(response)
        })
    }
    fromStationFilter(value) {
        let stationFilter = [];
        this.stationData.map((record, key) => {
            if (record.searchText.match(value) && stationFilter.length < 10) {
                stationFilter.push(record)
            }
        })
        this.setState({
            fromStation: stationFilter
        });
    }
    toStationFilter(value) {
        let stationFilter = [];
        this.stationData.map((record, key) => {
            if (record.searchText.match(value) && stationFilter.length < 10) {
                stationFilter.push(record)
            }
        })
        this.setState({
            toStation: stationFilter
        });
    }
    render() {
        const { startValue, endValue } = this.state;
        return (
            <div className="wec">
                <h3>订票小哥呀！</h3>
                <div className="check-info">
                    <div className="station">
                        <span>出发站：</span>
                        <Station
                            data={this.state.fromStation}
                            getStionCode={this.getFromStationCode.bind(this)}
                            fromStationFilter={this.fromStationFilter.bind(this)}
                        />
                    </div>
                    <div className="station">
                        <span>终点站：</span>
                        <Station data={this.state.toStation}
                            getStionCode={this.getToStationCode.bind(this)}
                            fromStationFilter={this.toStationFilter.bind(this)}
                        />
                    </div>
                    {/*终点站：<Input className="station" size="large"/>*/}
                    出发日：<DatePicker
                        disabledDate={this.disabledStartDate.bind(this)}
                        showTime
                        className="date-picker"
                        format="YYYY-MM-DD"
                        value={startValue}
                        placeholder="出发时间"
                        size="large"
                        style={{ width: 200, height: 30, 'marginRight': 10, }}
                        onChange={this.onStartChange.bind(this)}
                        onOpenChange={this.handleStartOpenChange.bind(this)}
                    />
                    {/*返回日：<DatePicker
                        disabledDate={this.disabledEndDate.bind(this)}
                        showTime
                        className="date-picker"
                        format="YYYY-MM-DD"
                        value={endValue}
                        size="large"
                        style={{ width: 200, height: 30 }}
                        placeholder="返回时间"
                        onChange={this.onEndChange.bind(this)}
                        onOpenChange={this.handleEndOpenChange.bind(this)}
                    />*/}
                    <RadioGroup onChange={this.purposeChange.bind(this)} value={this.state.purposeCode}>
                        <Radio value="ADULT">成人</Radio>
                        <Radio value="0X00">学生</Radio>
                    </RadioGroup>
                    <Button className="checked" size="large" className="blue-btn" onClick={this.getTickets.bind(this)}>查询</Button>
                </div>
                <Table dataSource={this.state.dataSource} columns={columns} pagination={false} />
            </div>
        );
    }
}
export default index