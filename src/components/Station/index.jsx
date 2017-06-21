import React, { Component } from 'react';
import { AutoComplete } from 'antd';
const Option = AutoComplete.Option;

class index extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     dataSource: this.props.data
        // }
        this.timer = null;
    }

    handleSearch(value) {
        
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.props.fromStationFilter(value);
        }, 500)
        
    }
    onSelect(value, option) {
        this.props.getStionCode(value);
    }

    render() {
        const { data } = this.props;
        
        return (
            <AutoComplete
                style={{ width: 200 }}
                onSelect={this.onSelect.bind(this)}
                onSearch={this.handleSearch.bind(this)}
                placeholder="input here"
            >
                {
                    data.map((record) => {
                        return <Option key={record.searchText} value={record.nameCode}>{record.name}</Option>;
                    })
                }
            </AutoComplete>
        );
    }
}
export default index