import React, { Component } from 'react'

export class Error extends Component {

    constructor(props){
        super(props);
    }

    render() {
            return <div><br></br>{this.props.msg}</div>
    }
}

export default Error
