class TimerDashboard extends React.Component{
    state={
        timers:[]
    }

    componentDidMount(){
        this.setState({
            timers: [
                {title: 'Learn React', project: 'Web Domination', elapsed: '8986300', runningSince: null},
                {title: 'Learn extreme ironing', project: 'Web Domination', elapsed: '3890985', runningSince: null}
            ]
        })
    }

    render(){
        return(
            
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={this.state.timers} />
                    <ToggleableTimerForm />        
                </div>
            </div>
            
        )
    }
}

class EditableTimerList extends React.Component{    
    render(){
        const timers=this.props.timers.map((timer,index)=><EditableTimer key={'timer-'+index} timer={timer} />)        
        return(
            <div id="timers">
               {timers}
            </div>
        )
    }
}

class EditableTimer extends React.Component{    
    state={
        isOpen: false
    }

    render(){        
        const {timer}=this.props
        console.log("timer", this.props, timer)
        return(this.state.isOpen 
            ? <TimerForm title={timer.title} project={timer.project}/>  
            : <Timer timer={timer} />)        
    }
}

class TimerForm extends React.Component{
    render(){        
        return(
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title:</label>
                            <input type='text' defaultValue={this.props.title} />
                        </div>
                        <div className='field'>
                            <label>Project:</label>
                            <input type='text' defaultValue={this.props.project} />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>{this.props.title ? 'Update' : 'Create'}</button>
                            <button className='ui basic red button'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

class Timer extends React.Component{
    render(){
        const {title, project, elapsed, runningSince}=this.props.timer
        const elapsedString=helpers.renderElapsedString(elapsed)        
        return(
        <div className='ui centered card'>
            <div className='content'>
                <div className='header'>
                    {title}
                </div>
                <div className='meta'>
                    {project}
                </div>
                <div className='centered aligned description'>
                    <h2>{elapsedString}</h2>
                </div>
                <div className='extra content'>
                    <span className='right floated edit icon'>
                        <i className='edit icon'/>
                    </span>
                    <span className='right floated trash icon'>
                        <i className='trash icon'/>
                    </span>
                </div>
            </div> 
            <div className='ui bottom attached blue basic button'>
                Start
            </div>               
        </div>)
    }
}

class ToggleableTimerForm extends React.Component{
    state={
        isOpen: false
    }
    render(){
        return (
            this.state.isOpen
            ? <TimerForm />
            : <div className='ui basic content center aligned segment'>
                <button  className='ui basic button icon'> 
                    <i className='plus icon'/>
                </button>
            </div>
            )
    }
}

ReactDOM.render(
    <TimerDashboard />,
    document.getElementById('content')
  );