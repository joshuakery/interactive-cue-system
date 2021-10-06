import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';
import p5 from 'p5';

/**
 * Creates a p5js canvas element with a socket connection
 * 
 * p5js canvas in React follows the implementation by
 * Christian Kastner's tutorial at
 * https://dev.to/christiankastner/integrating-p5-js-with-react-i0d
 * 
 * in which we create a Sketch object to keep our variables local
 * and we use it with React's createRef so that our canvas isn't constantly
 * updating with every user action (the default React behavior)
 * 
 * @param String inputID - is both the name of the socket.io room to join
 * and the firebase db node where to store data for this canvas
 *
 */
class P5Canvas extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
 
  }

  Sketch = (p) => {
    const { userUID, inputID } = this.props;
    const socket = this.props.socket.socket;

    var drawing;
    var prev, clients = {};
    var myLines = [];
    var lastEmit, now;

    p.serialize = lines => {
      var serialized = [];
      lines.forEach(l => {
        serialized.push({
          x1:l[0],
          y1:l[1],
          x2:l[2],
          y2:l[3],
          // color:l[4],
          // weight:l[5]
        });
      });
      return serialized;
    }

    p.deserialize = l => {
      var deserialized = [];
      //line
      deserialized[0] = l.x1;
      deserialized[1] = l.y1;
      deserialized[2] = l.x2;
      deserialized[3] = l.y2;
      // //color
      // deserialized[4] = l.color;
      // //weight
      // deserialized[5] = l.weight;
       
      return deserialized;
    }

    p.setup = () => {
      console.log('setting up canvas');
      p.createCanvas(400, 400);
      p.background(255);

      prev = {};
      drawing = false;
      lastEmit = 0;
      myLines = [];

      /**
       * Our server shares anyone's 'mousemove' actions
       * including mouseMove and mouseDragged (see below)
       * with everyone else in our room.
       * 
       * These each come to us as a 'moving' event
       * which we only need to parse if we need to draw for it
       * like actions named 'line'
       * 
       */
      socket.on('moving', (action) => {
        const {id,name,data} = action;
        if (name === 'line') {
          /* draw if (data.drawing) i.e. this is not the first point in the line */
          /* and if (clients[id]) i.e. we have saved a preceding point in the line for this user */
          if (data.drawing && clients[id]) {
            var x0 = clients[id].x;
            var y0 = clients[id].y;
            var l = [
              x0, y0,
              data.x, data.y,
              // subaction.color,
              // subaction.weight
            ];
            p.drawLine(l);
          }
        }

        clients[id] = data;
        clients[id].updated = now;
      });

      /**
       * We use firebase here to fetch all the previously drawn lines
       * during our canvas setup.
       * 
       * But we will use sockets to capture lines draw by other users
       * in real time, instead of a firebase 'on' listener.
       *
       */
      this.props.firebase.userInput(inputID).once('value', snapshot => {
        const userInput = snapshot.val();
        if (!userInput) return;
        Object.keys(userInput).forEach(key => {
          const action = userInput[key];
          p.drawAction(action);
        })
      });

      p.stroke('gray');
      p.noFill();
      p.rect(0,0,p.width,p.height);

    }

    /**
     * We use the p5 draw function only to keep track of time passed
     * in order to limit the frequency with which we emit our actions
     * to other users.
     * 
     * For our 'mousemove' events
     * we only want to emit with a certain frequency
     * in this case, a hard-coded 30 milliseconds.
     * 
     */
    p.draw = () => {
      now = p.millis();
    }

    /**
     * Parses an action object for what to draw
     * 
     */
    p.drawAction = action => {
      if (action == null) return;
      const { name, data } = action;
      if (name === 'line') {
        data.forEach(l => {
          var deserialized = p.deserialize(l);
          p.drawLine(deserialized);
        });
      }
    }

    /**
     * Draws a line
     * 
     */
    p.drawLine = l => {
      p.stroke('black');
      p.strokeWeight(4);
      // p.stroke( l[4] ? color(l[4]) : color('#000000') );
      // p.strokeWeight( l[5] ? l[5] : 1 );
      if (!l[0]) return;
      p.line(l[0],l[1],l[2],l[3]);
    }

    /**
     * Emit a 'mousemove' event to other users
     * including data about our mouse position
     * and crucially, that this is a 'line' action
     * 
     */
    const dragged = () => {
      if (drawing) {
        var l = [
          prev.x, prev.y,
          p.mouseX, p.mouseY,
        ];
        p.drawLine(l);
        /* myLines used to record lines for serialization and saving to firebase */
        myLines.push(l);
      }
      drawing = true;
      prev.x = p.mouseX;
      prev.y = p.mouseY;
      /* limit when we will emit an update to other users in the room */
      /* note the hard-coded 30 milliseconds */
      if (now - lastEmit > 30) {
        socket.emit('mousemove',{
          room: inputID,
          'id':userUID,
          'name':'line',
          'data':{
            x: p.mouseX,
            y: p.mouseY,
            // 'x': mouseX / myScale,
            // 'y': mouseY / myScale,
            // 'color': colorPicker.val().toString('#rrggbb'),
            // 'weight': strokeWeightSlider.val() / myScale,
            drawing: drawing,
          }
        });
        lastEmit = now;
      }
    }

    p.touchMoved = () => {
      dragged();
      return false; //prevent scrolling on mobile
    }

    p.mouseDragged = () => {
      dragged();
    }

    /**
     * Serializes the last line drawn and saves to firebase
     * 
     */
    p.mouseReleased = () => {
        drawing = false;
        if (myLines.length === 0) return;
        const data = p.serialize(myLines);
        const action = {
          uid: userUID,
          name: 'line',
          data: data,
        };
        myLines = [];
        const newActionRef = this.props.firebase.userInput(inputID).push();
        newActionRef.set(action);

    }

    /**
     * Emit a 'mousemove' event to other users
     * including data about our mouse position
     * and crucially, that this is only a 'move' action
     * 
     */
    p.mouseMoved = () => {
      /* limit when we will emit an update to other users in the room */
      /* note the hard-coded 30 milliseconds */
      if (now - lastEmit > 30) {
        socket.emit('mousemove', {
          room: inputID,
          'id':userUID,
          'name':'move',
          'data':{
            x: p.mouseX,
            y: p.mouseY,
            // 'x': mouseX / myScale,
            // 'y': mouseY / myScale,
            // 'color': colorPicker.val().toString('#rrggbb'),
            // 'weight': strokeWeightSlider.val() / myScale,
            drawing: drawing
          }
        });
        lastEmit = now;
      }
    }
  }

  componentDidMount() {
    const socket = this.props.socket.socket;
    const { inputID } = this.props;

    socket.emit('joinroom', {
      room: inputID,
    });

    this.myP5 = new p5(this.Sketch, this.myRef.current);

  }

  componentWillUnmount() {
    const socket = this.props.socket.socket;
    const { inputID } = this.props;

    /* remove all of our event listeners, so we don't have any data leaks */
    socket.removeAllListeners();
    this.myP5.remove();
    this.props.firebase.userInput(inputID).off();

    socket.emit('leaveroom', {
      room: inputID,
    });
  }

  render() {
    return (
      <div ref={this.myRef}></div>
    );
  }
}


/*-------------------Export-------------------*/ 
export default compose(
  withFirebase,
  withSocket,
)(P5Canvas);