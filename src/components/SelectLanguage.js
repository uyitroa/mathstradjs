import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@popperjs/core";
import Dropdown from 'react-bootstrap/Dropdown';
import "bootstrap";
import {langCode} from "../api";


class SelectLanguage extends Component {
    constructor(props) {
        super(props);

        this.langCodeKey = Object.keys(langCode);
        this.langCodeKey.sort((a,b) => langCode[a].localeCompare(langCode[b]));

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(event) {
        this.props.setLang(event);
    }

    render() {
        return (
            <Dropdown onSelect={this.handleSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {langCode[this.props.lang]}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {this.langCodeKey.map(val => (
                        <Dropdown.Item eventKey={val}>{langCode[val]}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default SelectLanguage;