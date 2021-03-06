import React,{useState , Component} from 'react';
import MomentOverlay from './momentOverlay';

export default function Moment({title,content,date}) {

    const[isOpen,setIsOpen] = useState(false)
    //this doesnt seem to be re rendering the portal when the state changes for some reason
    return(
        <div className="moment" onClick = {() => setIsOpen(true)}>
        <div className="icon"></div>
        <div className="momentText">

            <h2 className="momentTitle">{title}</h2>
            <p>{content}</p>
            <p className="dateText">{date}</p>
        </div>
        <MomentOverlay open={isOpen} onClose={() => setIsOpen(false)}/>
    </div>
    
    )
    
}
