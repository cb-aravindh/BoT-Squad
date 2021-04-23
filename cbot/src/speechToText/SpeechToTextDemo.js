import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import {
    Paper,
    Button,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import SpeechToText from 'speech-to-text';

import supportedLanguages from '../supportedLanguages';
import dd from "../assets/img/sup.svg";
import cbTitle from "../assets/img/cb-title.svg"

const styles = theme => ({
    root: {
        paddingTop: 65,
        paddingLeft: 11,
        paddingRight: 11
    },
    flex: {
        flex: 1
    },
    grow: {
        flexGrow: 1
    },
    paper: theme.mixins.gutters({
        paddingTop: 22,
        paddingBottom: 22
    }),
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

class SpeechToTextDemo extends Component {
    state = {
        error: '',
        interimText: '',
        finalisedText: '',
        listening: false,
        language: 'en-US',
        intro : true,
        res: {},
        listRes: [],
        type: '',
        count: 0,
        spaceOn: false
    };

    componentDidMount() {
        // window.responsiveVoice.speak("Hi Aravindh! Please use C-Mini to get started!");
    }

    onAnythingSaid = text => {
        this.setState({ interimText: text });
    };

    onEndEvent = () => {
        if (!isWidthUp('sm', this.props.width)) {
            this.setState({ listening: false });
        } else if (this.state.listening) {
            this.startListening();
        }
    };

    onFinalised = text => {
        this.setState({
            finalisedText: text,
            interimText: ''
        });
    };

    startListening = () => {
        this.setState({listRes: [], count: 0});
        if(this.state.intro) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = "I'm Listening, Aravindh";
            window.speechSynthesis.speak(msg);
            // this.sleep(1000);
            this.setState({intro: false});
        }
        try {
            this.listener = new SpeechToText(
                this.onFinalised,
                this.onEndEvent,
                this.onAnythingSaid,
                this.state.language
            );
            this.listener.startListening();
            this.setState({ listening: true});
        } catch (err) {
            console.log('yoyoy');
            console.log(err);
        }
    };

    stopListening = () => {
        this.listener.stopListening();
        this.setState({ listening: false}); // add intro : true  for getting voice on each click
        console.log("Text : " + this.state.finalisedText);
        function isGeneral(text, flagIteam) {
            text = text.replace(/\s/g, "");
            text = text.toLowerCase();
            switch(text) {
                case "hello":
                    if(flagIteam) {
                        return true;
                    }
                    return  "Hi, how are you doing?";
                case "what'syourname":
                    if(flagIteam) {
                        return true;
                    }
                    return "My name's C-Mini.";
                case "howareyou":
                    if(flagIteam) {
                        return true;
                    }
                    return "I'm good.";
                case "whattimeisit":
                    if(flagIteam) {
                        return true;
                    }
                    return new Date().toLocaleTimeString();
                case "whatallcanyoudoforme":
                    if(flagIteam) {
                        return true;
                    }
                    return "Good question Aravindh, I can do these tasks for now" +
                        "1. Querying your Chargebee Data (Example: Say, List the subscriptions created yesterday)" +
                        "2. Help you with How to, kind of questions ( Example: Say, How to integrate with Salesforce or How to retrieve data using Export API and," +
                        "3. Settings Automation( Say, Add CAD to my Currency)";
                case "thankyou":
                    if(flagIteam) {
                        return true;
                    }
                    return "Thank you guys, glad to be part of Chargebee Virtual Hackathon Demo. See you soon!";
            }
        }

        if(this.state.finalisedText.includes("how to")){
            window.open(`http://google.com/search?q=${this.state.finalisedText.replace("search", "")}`, "_blank");
            var msg = new SpeechSynthesisUtterance();
            msg.text = "I found some information for " + this.state.finalisedText;
            speechSynthesis.speak(msg);
        } else if (isGeneral(this.state.finalisedText, true)) {
            let response = isGeneral(this.state.finalisedText, false);
            var msg = new SpeechSynthesisUtterance();
            msg.text = response;
            msg.rate = 1;
            msg.pitch = 1;
            speechSynthesis.speak(msg);
        } else {
            var data = {
                "speech": this.state.finalisedText
            };
            axios.post("https://kzkj1nuctd.execute-api.us-east-1.amazonaws.com/dev", data)
                .then((res) => {
                    console.log(res);
                    var msg = new SpeechSynthesisUtterance();
                    if (res.data.hasOwnProperty("type") && res.data.hasOwnProperty("list") && (res.data.type === "subscription" || res.data.type === "customer")) {
                        msg.text = "These were the results I found. There were " + res.data.list.length + " " + res.data.type + "s";
                        window.speechSynthesis.speak(msg);
                        this.setState({listRes: res.data.list, type: res.data.type}, () => {
                            console.log(this.state.listRes);
                            console.log(this.state.type);
                        });
                    } else if (res.data.hasOwnProperty("type") && res.data.hasOwnProperty("count")) {
                        msg.text = "These were the results I found. There were " + res.data.count + " " + res.data.type + "s";
                        window.speechSynthesis.speak(msg);
                        this.setState({count: res.data.count, type: res.data.type});
                    } else {
                        msg.text = "Sorry Aravindh, we couldn't find any information.";
                        window.speechSynthesis.speak(msg);
                    }
                });
        }
    };

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms || 1000));
    }

    render() {
        const {
            error,
            interimText,
            finalisedText,
            listening,
            language,
            intro,
            res,
            listRes,
            type,
            count
        } = this.state;
        const { classes } = this.props;
        let content;
        let customerVsSub;
        let customerObj;
        let subObj;
        if (error) {
            content = (
                <Paper className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                        {error}
                    </Typography>
                </Paper>
            );
        } else {
            let buttonForListening;

            if (listening) {
                buttonForListening = (
                    <Button color="primary" onClick={() => this.stopListening()}>
                        Get Answer
                    </Button>
                );
            } else {
                buttonForListening = (
                    <Button
                        color="primary"
                        onClick={() => this.startListening()}
                        variant="contained"
                    >
                        Talk to C-Mini
                    </Button>
                );
            }
            content = (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>
                        <Paper className={this.props.classes.paper}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={12}>
                                    <Typography variant="overline" gutterBottom>
                                        Status: {listening ? 'Started listening...' : 'finished listening'}
                                    </Typography>
                                    {buttonForListening}
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <FormControl className={classes.formControl} id="language-chooser" style={{display : "none"}}>
                                        <InputLabel>Language</InputLabel>
                                        <Select
                                            value={language}
                                            onChange={evt =>
                                                this.setState({ language: evt.target.value })
                                            }
                                            disabled={listening}
                                        >
                                            {supportedLanguages.map(language => (
                                                <MenuItem key={language[1]} value={language[1]}>
                                                    {language[0]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            What language are you going to speak in?
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper className={this.props.classes.paper}>
                            <Typography variant="overline" gutterBottom>
                                Current utterances
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {interimText}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        {finalisedText && (<Paper className={classes.paper}>
                            Search for : {finalisedText ? finalisedText : "\"Ask Anything to search\""}
                        </Paper>)}
                    </Grid>
                </Grid>
            );
        }

        let responseContent = [];
        if(this.state.listRes && this.state.listRes.length > 0) {
            this.state.listRes.map((obj, index) => {
                if(index === 0) {
                    responseContent.push(<div className="col-sm-12 mb-3"><h4>Count: {this.state.listRes.length}</h4></div>);
                }
                responseContent.push(<div className="col-lg-4"><div className="card bg-light mb-5" style={{maxWidth: "18rem", }}>
                    <div className="card-header"><span><b>ID</b>: {obj["customer"]["id"]}</span><span className="badge badge-pill badge-dark" style={{float : "right"}}>{type}</span></div>
                    <div className="card-body">
                        <h5 className="card-title"><b>Name</b>: {obj["customer"]["first_name"] + " " + obj["customer"]["last_name"]}</h5>
                        <p className="card-text"><b>Email</b>: {obj["customer"]["email"]}</p>
                        {obj.hasOwnProperty("subscription")? <p className="card-text"><b>Plan Name</b>: {obj["subscription"]["plan_id"]}</p> : ""}
                    </div>
                </div></div>);
            })
            // this.setState({listRes: []});
        }

        if(this.state.count > 0) {
            responseContent.push(<div className="col-sm-12 mb-3" style={{textAlign: "center"}}><h2>Count: {this.state.count}</h2></div>);
            // this.setState({count: 0});
        }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="row" style={{marginTop: "5%", textAlign: "center"}}>
                            <div className="col-lg-4">
                                <span style={{marginTop: "6%", marginLeft: "3%"}}><img src={cbTitle} className="img-responsive"/></span>
                            </div>
                        </div>
                        <div style={{marginTop: "10%", textAlign: "center"}}>
                            <img src={dd} alt="this slowpoke moves"  width={250}/>
                            <Grid container>
                                <Grid container justify="center" className={classes.root}>
                                    <Grid item xs={12} sm={8}>
                                        {content}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div className="col-lg-8" style={{paddingTop: "4%"}}>
                        <div className="row">
                            {responseContent}
                        </div>
                    </div>
                    </div>
            </div>
        );
    }
}

export default withWidth()(withStyles(styles)(SpeechToTextDemo));
