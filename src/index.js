class Process {
  constructor(id, name, pid) {
    this.id = id;
    this.pid = pid;
    this.name = name;
    this.messages = [];
    this.msg_queue = "";
    this.leader = pid;
    this.recieved_leader = 0;
    this.allMsgs = "";
    this.active = false;
    this.cur_msg = "";
    this.state = "n";
  }

  // retrun state to control rendering
  getState() {
    let msgs = this.messages.join(" ");
    return {
      id: this.id,
      name: this.name,
      allMsgs: msgs,
      active: this.active,
      cur_msg: this.cur_msg,
      state: this.state,
    };
  }
}

class Simulation {
  constructor(numberOfProcesses, starter, processNames) {
    this.processes = [...Array(numberOfProcesses).keys()].map(
      (i) =>
        new Process(1 + i, "Process ".concat(processNames[i]), processNames[i])
    );
    this.current_process = this.processes[starter - 1];
    this.running = true;
  }

  election_msg(cur, next) {
    let msg = "";
    msg = `e( ${cur.leader} )`;
    // update your own msgs
    cur.messages = [...cur.messages, msg];
    // update next queue
    next.msg_queue = msg;
    cur.active = true;
    cur.cur_msg = msg;
  }

  leader_msg(cur, next) {
    let msg = "";
    msg = `l( ${cur.leader} )`;
    // update your own msgs
    cur.messages = [...cur.messages, msg];
    // update next queue
    next.msg_queue = msg;
    cur.active = true;
    cur.cur_msg = msg;
  }

  // look at state and pass new mess or ignore
  election() {
    // get current and next process
    let cur = this.current_process;
    let current_process_i = this.current_process.id - 1;
    let next_process_i = (current_process_i + 1) % this.processes.length;
    let next = this.processes[next_process_i];

    // case when init elections
    if (cur.msg_queue === "") {
      cur.state = "r";
      this.election_msg(cur, next);
    } else {
      // check the type of the message
      if (cur.msg_queue.startsWith("e")) {
        // parse message send by predessor to get election message
        cur.recieved_leader = parseInt(cur.msg_queue.split(" ")[1]);
        cur.msg_queue = "";
        if (cur.recieved_leader > cur.leader) {
          cur.state = "n";
          cur.leader = cur.recieved_leader;
          this.election_msg(cur, next);
        } else if (cur.recieved_leader < cur.leader) {
          cur.state = "r";
          this.election_msg(cur, next);
        } else {
          // send leader msg
          this.leader_msg(cur, next);
        }
      } else if (cur.msg_queue.startsWith("l")) {
        cur.recieved_leader = parseInt(cur.msg_queue.split(" ")[1]);
        cur.msg_queue = "";
        cur.leader = cur.recieved_leader;
        // check for simluation end
        if (cur.leader === cur.pid) {
          //end sim
          cur.state = "l";
          this.running = false;
        } else {
          this.leader_msg(cur, next);
        }
      } else {
        console.log("Something went wrong :);");
      }
    }
  }

  step() {
    for (let i = 0; i < this.processes.length; i++) {
      this.processes[i].active = false;
      this.processes[i].cur_msg = "";
    }
    // election happens here
    if (this.running) {
      this.election();
      let current_process_i = this.current_process.id - 1;
      let next_process_i = (current_process_i + 1) % this.processes.length;
      //this.processes[current_process_i].active = false;
      this.current_process = this.processes[next_process_i];
    }
    console.log(this.processes);
  }
}

export { Simulation, Process };
