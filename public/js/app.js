class TimerDashboard extends React.Component{
    state={
        timers:[]
    }

 
    componentDidMount() {
        this.loadTimersFromServer();
        setInterval(this.loadTimersFromServer, 5000);
      }

    loadTimersFromServer = () => {
        client.getTimers((serverTimers) => (
            this.setState({ timers: serverTimers })
          )
        );
      };

    handleCreate=(timer)=>{      
        this.createTimer(timer)          
    }

    handleEdit=(timer)=>{        
        this.updateTimers(timer)        
    }

    handleDelete=(id)=>{
        this.deleteTimer(id)
    }

    createTimer=(timer)=>{
        const newTimer=helpers.newTimer(timer)
        this.setState({timers: this.state.timers.concat(newTimer)})
        client.createTimer(timer)
    }

    deleteTimer=(id)=>{
        const newTimers=this.state.timers.filter(item=>item.id!==id)
        this.setState({timers: newTimers})
        client.deleteTimer({id: id})
    }

    updateTimers=(timer)=>{
        const newTimers=this.state.timers.map(item=>item.id===timer.id ? timer : item)
        this.setState({timers: newTimers})
        client.updateTimer(timer)

    }

    handleStart=(id)=>{
        const now=Date.now()
        const newTimers=this.state.timers.map(item=> item.id==id ? Object.assign({}, item, {runningSince: now}) : item )
        this.setState({timers: newTimers}) 
        client.startTimer({id: id, start: now}) 
        
    }

    handleStop=(id)=>{
        const now=Date.now()
        const newTimers=this.state.timers.map(item=> 
            item.id==id 
            ? Object.assign({}, item, {elapsed:now-item.runningSince+item.elapsed,runningSince: null}) 
            : item )
        this.setState({timers: newTimers}) 
        client.stopTimer({id: id, stop: now})         
    }

    render(){
        return(
            
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList 
                        timers={this.state.timers} 
                        update={this.handleEdit} 
                        delete={this.handleDelete} 
                        start={this.handleStart} 
                        stop={this.handleStop}
                        />
                    <ToggleableTimerForm update={this.handleCreate} />        
                </div>
            </div>
            
        )
    }
}

class EditableTimerList extends React.Component{    
    render(){
        const timers=this.props.timers.map((timer,index)=>
            <EditableTimer 
                key={'timer-'+index} 
                timer={timer} 
                update={this.props.update} 
                delete={this.props.delete} 
                start={this.props.start}
                stop={this.props.stop}/>)        
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

    toggleView=()=>{
        this.setState({isOpen: !this.state.isOpen})
    }

    update=(timer)=>{
        this.props.update(timer)
        this.setState({isOpen: !this.state.isOpen})
    }  

    render(){        
        const {timer, start,stop}=this.props        
        return(this.state.isOpen 
            ? <TimerForm timer={timer} update={this.update} cancel={this.toggleView} />  
            : <Timer timer={timer} update={this.toggleView} delete={this.props.delete} start={start} stop={stop}/>)        
    }
}

class TimerForm extends React.Component{
    
    state={
     id: this.props.timer ? this.props.timer.id : 0,   
     title: this.props.timer ? this.props.timer.title :'', 
     project: this.props.timer ? this.props.timer.project : '',
     elapsed: this.props.timer ? this.props.timer.elapsed : '', 
     runningSince: this.props.timer ? this.props.timer.runningSince :null
    }

    handleChange=(e)=>{
      this.setState({[e.target.name]: e.target.value})
    }

    render(){            
        return(
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title:</label>
                            <input type='text' name='title'  value={this.state.title} onChange={this.handleChange}/>
                        </div>
                        <div className='field'>
                            <label>Project:</label>
                            <input type='text' name='project'  value={this.state.project} onChange={this.handleChange}/>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={()=>this.props.update(this.state)}>{this.props.timer ? 'Update' : 'Create'}</button>
                            <button className='ui basic red button' onClick={this.props.cancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

class Timer extends React.Component{
   
    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
      }
    
      componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
      }

      handleStartClick=()=>{       
        this.props.start(this.props.timer.id)
      }

      handleStopClick=()=>{        
        this.props.stop(this.props.timer.id)
      }
    
    render(){
        const {id,title, project, elapsed, runningSince}=this.props.timer
        const elapsedString=helpers.renderElapsedString(elapsed, runningSince)                
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
                        <i className='edit icon' onClick={this.props.update}/>
                    </span>
                    <span className='right floated trash icon'>
                        <i className='trash icon' onClick={()=>this.props.delete(id)}/>
                    </span>
                </div>
            </div> 
            <TimerActionButton
                timerIsRunning={!!runningSince}
                onStartClick={this.handleStartClick}
                onStopClick={this.handleStopClick}
             />
                     
        </div>
        )
    }
}

class TimerActionButton extends React.Component{
    render(){
        const {timerIsRunning,onStartClick,onStopClick}=this.props       
        return(
            timerIsRunning 
                ? <div className='ui bottom attached red basic button' onClick={onStopClick} > Stop </div>     
                : <div className='ui bottom attached green basic button' onClick={onStartClick} > Start </div>    
        )
    }
}


class ToggleableTimerForm extends React.Component{
    state={
        isOpen: false
    }

    toggleForm=()=>{
      this.setState({isOpen: !this.state.isOpen})  
    }

    handleUpdate=(timer)=>{
        this.props.update(timer)
        this.setState({isOpen: !this.state.isOpen})  
    }

    render(){
        return (
            this.state.isOpen
            ? <TimerForm cancel={this.toggleForm} update={this.handleUpdate}/>
            : <div className='ui basic content center aligned segment'>
                <button  className='ui basic button icon' onClick={this.toggleForm}> 
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