let json = {};
let jsonCOPY = {};

let jsonName;
let offlineRenderer;
let synthA, synthB;
let synthAcounter, synthBcounter;
let melodyType, bassType
let melodySpeed, bassSpeed;
let toneDropdowns = [];
let twelveToneArr = [];
let melArr = [];
let basArr = [];
let melComplex = [];
let basComplex = [];
let notComplex = [];
let melRhythmArr = [];
let basRhythmArr = [];
let bpmInput, shuffleButton, togglePlayButton,
  bassRhythmDropdown, melodyRhythmDropdown,
  bassSetFormDropdown, melodySetFormDropdown,
  melodyRow, bassRow, melSynthButton, basSynthButton,
  synthAVolSlider, synthBVolSlider,
  saveJSONButton, saveInput,
  loadJSONButton, loadJSONFile, resetButton;


function setup() {

  //DRAW TO CANVAS HERE
  createCanvas(450, 180);
  background(200, 200, 255);

  // Tone.context.suspend();

  jsonName = 'name'
  synthAcounter = synthBcounter = 0;
  melodySpeed = bassSpeed = 1;
  melodyType = bassType = 'prime';
  Tone.Transport.bpm.value = 85;
  Tone.Transport.timeSignature = [12, 4];
  melComplex = [0, -0.25, 0, 0.25, 0.25, 0, -0.25, -0.25, -0.25, 0, 0.25, 0.25]
  basComplex = [0, 0.25, -0.25, 0.25, 0, 0.25, 0, -0.25, -0.25, -0.25, 0.25, 0]
  for (let i = 0; i < 48; i++) {
    notComplex[i] = 0
  }
  melRhythmArr = basRhythmArr = notComplex

  //tempo
  //tone row
  //melody rhythm
  //bass rhythm
  //melody set form
  //bass set form
  //melody synth
  //bass synth
  //melody volume
  //bass volume

  json.tempo = 85;
  json.tonerow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  json.melodyRhythm = 'slow'
  json.bassRhythm = 'slow'
  json.melodySetForm = 'prime'
  json.bassSetForm = 'prime'
  json.melodySynth = 'AMSynth'
  json.bassSynth = 'AMSynth'
  json.melodyVolume = 0
  json.bassVolume = 0

  jsonCOPY = json;
  console.log(json)

  //==================== USER INTERFACE ====================\\

  //BPM INPUT
  createDiv('Tempo')
    .position(4, 8).style('font-family', 'arial').style('font-size', '14px')
  bpmInput = createInput(85).position(100 + 10, 8).size(40, 12);
  bpmInput.changed(() => {
    if (!isNaN(bpmInput.value())) {
      console.log(bpmInput.value());
      Tone.Transport.bpm.value = bpmInput.value();
      json.tempo = bpmInput.value();
    } else {
      console.log(typeof bpmInputValue)
    }
  });

  // loadJSONButton = createButton('load').position(width-50, 8)
  // loadJSONButton.mouseClicked()
  // loadJSONButton.hide()
  loadJSONFile = createFileInput(gotData).position(180, 8)
  resetButton = createButton('RESET').position(370, 8);
  resetButton.mouseClicked(() => {
    // json = jsonCOPY

    json.tempo = 85;
    json.tonerow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    json.melodyRhythm = 'slow'
    json.bassRhythm = 'slow'
    json.melodySetForm = 'prime'
    json.bassSetForm = 'prime'
    json.melodySynth = 'AMSynth'
    json.bassSynth = 'AMSynth'
    json.melodyVolume = 0
    json.bassVolume = 0
    console.log(json)
    buildSettings()
  })

  //programmatically generate dropdown menus
  createDiv('Tone Row').position(4, 32).style('font-family', 'arial').style('font-size', '14px')
  for (let i = 0; i < 12; i++) {
    twelveToneArr[i] = i;
    toneDropdowns[i] = createSelect()
      .position(100 + 26 * i + 10, 32)
      .style("-webkit-appearance", "none")
      .style("-moz-appearance", "none")
      .style('font-family', 'arial')
      .style("padding", "1px")
      .size(26, 16);
    toneDropdowns[i].changed(() => {
      twelveToneArr[i] = Number(toneDropdowns[i].value());
      json.tonerow = twelveToneArr
      setMelodyBassType()
      bassRow.html('bass: ' + basArr);
      melodyRow.html('melody: ' + melArr)
      synthAcounter = synthBcounter = 0;
    });
    for (let j = 0; j < 12; j++) {
      toneDropdowns[i].option(j.toString());
    }
    toneDropdowns[i].value(i);
  }
  melArr = basArr = twelveToneArr;

  createDiv('Melody Rhythm')
    .position(4, 52)
    .style('font-family', 'arial')
    .style('font-size', '14px')
  melodyRhythmDropdown = createSelect()
    .position(100 + 10, 52)
    .style('font-family', 'arial')
  	.size(60)
  melodyRhythmDropdown.option('slow');
  melodyRhythmDropdown.option('medium');
  melodyRhythmDropdown.option('fast');
  melodyRhythmDropdown.option('complex');
  melodyRhythmDropdown.changed(() => {
    json.melodyRhythm = melodyRhythmDropdown.value()
    synthAcounter = synthBcounter = 0;
    if (melodyRhythmDropdown.value() === 'slow') {
      melodySpeed = 1;
      melRhythmArr = notComplex
    } else if (melodyRhythmDropdown.value() === 'medium') {
      melodySpeed = 2;
      melRhythmArr = notComplex
    } else if (melodyRhythmDropdown.value() === 'fast') {
      melodySpeed = 3;
      melRhythmArr = notComplex
    } else if (melodyRhythmDropdown.value() === 'complex') {
      melodySpeed = 1;
      melRhythmArr = melComplex
    }
    Tone.Transport.cancel(0);
    for (let i = 0; i < 12 * melodySpeed; i++) {
      Tone.Transport.schedule(triggerSynthA, (i + melRhythmArr[i]) * (60 / melodySpeed) / Tone.Transport.bpm.value)
    }
    for (let i = 0; i < 12 * bassSpeed; i++) {
      Tone.Transport.schedule(triggerSynthB, (i + basRhythmArr[i]) * (60 / bassSpeed) / Tone.Transport.bpm.value)
    }
  })

  createDiv('Bass Rhythm').position(4, 72).style('font-family', 'arial').style('font-size', '14px')
  bassRhythmDropdown = createSelect()
    .position(100 + 10, 72)
    .style('font-family', 'arial')
  	.size(60)
  bassRhythmDropdown.option('slow');
  bassRhythmDropdown.option('medium');
  bassRhythmDropdown.option('fast');
  bassRhythmDropdown.option('complex');
  bassRhythmDropdown.changed(() => {
    json.bassRhythm = bassRhythmDropdown.value()
    synthAcounter = synthBcounter = 0;
    if (bassRhythmDropdown.value() === 'slow') {
      bassSpeed = 1;
      basRhythmArr = notComplex
    } else if (bassRhythmDropdown.value() === 'medium') {
      bassSpeed = 2;
      basRhythmArr = notComplex
    } else if (bassRhythmDropdown.value() === 'fast') {
      bassSpeed = 3;
      basRhythmArr = notComplex
    } else if (bassRhythmDropdown.value() === 'complex') {
      bassSpeed = 1;
      basRhythmArr = basComplex
    }
    Tone.Transport.cancel(0);
    for (let i = 0; i < 12 * melodySpeed; i++) {
      Tone.Transport.schedule(triggerSynthA, (i + melRhythmArr[i]) * (60 / melodySpeed) / Tone.Transport.bpm.value)
    }
    for (let i = 0; i < 12 * bassSpeed; i++) {
      Tone.Transport.schedule(triggerSynthB, (i + basRhythmArr[i]) * (60 / bassSpeed) / Tone.Transport.bpm.value)
    }
  })

  createDiv('Bass Set Form').position(184, 72).style('font-family', 'arial').style('font-size', '14px')
  bassSetFormDropdown = createSelect()
    .position(294, 72)
    .style('font-family', 'arial')
  	.size(100)
  
  bassSetFormDropdown.option('prime');
  bassSetFormDropdown.option('retrograde');
  bassSetFormDropdown.option('inversion');
  bassSetFormDropdown.option('retrograde inversion');
  bassSetFormDropdown.changed(() => {
    json.bassSetForm = bassSetFormDropdown.value();
    if (bassSetFormDropdown.value() === 'retrograde') {
      bassType = 'retrograde';
      basArr = twelveToneArr.slice().reverse();
    } else if (bassSetFormDropdown.value() === 'inversion') {
      bassType = 'inversion';
      basArr = twelveToneArr.map(x => (12 - x) % 12)
    } else if (bassSetFormDropdown.value() === 'retrograde inversion') {
      bassType = 'retrograde inversion';
      basArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
    } else if (bassSetFormDropdown.value() === 'prime') {
      bassType = 'prime';
      basArr = twelveToneArr;
    }
    bassRow.html('bass: ' + basArr);
  })

  createDiv('Melody Set Form').position(184, 52).style('font-family', 'arial').style('font-size', '14px')
  melodySetFormDropdown = createSelect()
    .position(294, 52)
    .style('font-family', 'arial')
  	.size(100)
  melodySetFormDropdown.option('prime');
  melodySetFormDropdown.option('retrograde');
  melodySetFormDropdown.option('inversion');
  melodySetFormDropdown.option('retrograde inversion');
  melodySetFormDropdown.changed(() => {
    json.melodySetForm = melodySetFormDropdown.value();
    if (melodySetFormDropdown.value() === 'retrograde') {
      melodyType = 'retrograde';
      melArr = twelveToneArr.slice().reverse();
    } else if (melodySetFormDropdown.value() === 'inversion') {
      melodyType = 'inversion';
      melArr = twelveToneArr.map(x => (12 - x) % 12)
    } else if (melodySetFormDropdown.value() === 'retrograde inversion') {
      melodyType = 'retrograde inversion';
      melArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
    } else if (melodySetFormDropdown.value() === 'prime') {
      melodyType = 'prime';
      melArr = twelveToneArr;
    }
    melodyRow.html('melody: ' + melArr)
  })

  //randomize row button
  shuffleButton = createButton('randomize row').position(4, 92);
  shuffleButton.mousePressed(() => {
    for (let i = 0; i < 12; i++) {
      twelveToneArr[i] = i;
    }
    twelveToneArr = shuffle(twelveToneArr);
    json.tonerow = twelveToneArr
    for (let i = 0; i < 12; i++) {
      toneDropdowns[i].value(twelveToneArr[i]);
    }
    melArr = basArr = twelveToneArr;
    synthAcounter = synthBcounter = 0;
    melodySetFormDropdown.value('prime');
    bassSetFormDropdown.value('prime');
    bassRow.html('bass: ' + basArr);
    melodyRow.html('melody: ' + melArr)
  })
  shuffleButton.hide();

  //Play Button
  togglePlayButton = createButton('play').position(24, 102);
  togglePlayButton.mousePressed(() => {
    if (Tone.Transport.state != "started") {
      synthAcounter = synthBcounter = 0;
      Tone.Transport.start('+0.1');
      togglePlayButton.html('stop');
    } else {
      Tone.Transport.stop();
      togglePlayButton.html('play');
    }
  })

  melodyRow = createDiv('melody: ' + melArr)
    .position(110, 92)
    .style('font-family', 'arial')
    .style('font-size', '14px')

  bassRow = createDiv('bass: ' + basArr)
    .position(110, 112)
    .style('font-family', 'arial')
    .style('font-size', '14px')

  createDiv('Melody Synth').position(10, 132).style('font-family', 'arial').style('font-size', '14px')
  melSynthButton = createSelect().position(110, 132).style('font-family', 'arial');
  melSynthButton.option('AMSynth');
  melSynthButton.option('FMSynth');
  // melSynthButton.option('PluckSynth'); //Starting pitch is off; should fix!
  melSynthButton.option('Sine');
  melSynthButton.option('Triangle');
  melSynthButton.option('Square');
  melSynthButton.option('Sawtooth');
  melSynthButton.changed(() => {
    json.melodySynth = melSynthButton.value();
    synthA.dispose();
    if (melSynthButton.value() === 'AMSynth') {
      synthA = new Tone.AMSynth().toMaster();
    } else if (melSynthButton.value() === 'FMSynth') {
      synthA = new Tone.FMSynth().toMaster();
    } else if (melSynthButton.value() === 'PluckSynth') {
      synthA = new Tone.PluckSynth().toMaster();
    } else if (melSynthButton.value() === 'Sine') {
      synthA = new Tone.Synth({
        "oscillator": {
          "type": "sine"
        }
      }).toMaster();
    } else if (melSynthButton.value() === 'Triangle') {
      synthA = new Tone.Synth({
        "oscillator": {
          "type": "triangle"
        }
      }).toMaster();
    } else if (melSynthButton.value() === 'Square') {
      synthA = new Tone.Synth({
        "oscillator": {
          "type": "square"
        }
      }).toMaster();
    } else if (melSynthButton.value() === 'Sawtooth') {
      synthA = new Tone.Synth({
        "oscillator": {
          "type": "sawtooth"
        }
      }).toMaster();
    }
  });

  createDiv('Bass Synth').position(10, 152).style('font-family', 'arial').style('font-size', '14px')
  basSynthButton = createSelect().position(110, 152).style('font-family', 'arial');
  basSynthButton.option('AMSynth');
  basSynthButton.option('FMSynth');
  // basSynthButton.option('PluckSynth'); //Starting pitch is off; should fix!
  basSynthButton.option('Sine');
  basSynthButton.option('Triangle');
  basSynthButton.option('Square');
  basSynthButton.option('Sawtooth');
  // basSynthButton.option('NoiseSynth');
  basSynthButton.changed(() => {
    json.bassSynth = basSynthButton.value();
    synthB.dispose()
    if (basSynthButton.value() === 'AMSynth') {
      synthB = new Tone.AMSynth().toMaster();
    } else if (basSynthButton.value() === 'FMSynth') {
      synthB = new Tone.FMSynth().toMaster();
    } else if (basSynthButton.value() === 'PluckSynth') {
      synthB = new Tone.PluckSynth().toMaster();
    } else if (basSynthButton.value() === 'Sine') {
      synthB = new Tone.Synth({
        "oscillator": {
          "type": "sine"
        }
      }).toMaster();
    } else if (basSynthButton.value() === 'Triangle') {
      synthB = new Tone.Synth({
        "oscillator": {
          "type": "triangle"
        }
      }).toMaster();
    } else if (basSynthButton.value() === 'Square') {
      synthB = new Tone.Synth({
        "oscillator": {
          "type": "square"
        }
      }).toMaster();
    } else if (basSynthButton.value() === 'Sawtooth') {
      synthB = new Tone.Synth({
        "oscillator": {
          "type": "sawtooth"
        }
      }).toMaster();
    }
  });

  synthAVolSlider = createSlider(-60, 0, 0, 0).position(220, 132);
  synthAVolSlider.input(() => {
    json.melodyVolume = synthAVolSlider.value()
    synthA.volume.linearRampTo(synthAVolSlider.value(), 0.1)
  })
  synthBVolSlider = createSlider(-60, 0, 0, 0).position(220, 152);
  synthBVolSlider.input(() => {
    json.bassVolume = synthBVolSlider.value()
    synthB.volume.linearRampTo(synthBVolSlider.value(), 0.1)
  })

  saveInput = createInput('name file').position(370, 130).size(60)
  saveInput.changed(() => {
    jsonName = saveInput.value()
  })

  saveJSONButton = createButton('save').position(width - 50, height - 25)
  saveJSONButton.mouseClicked(() => {
    saveJSON(json, jsonName + '.json')
  })
  // saveJSONButton.hide()


  //==================== SYNTHS ====================
  synthA = new Tone.AMSynth().toMaster();
  synthB = new Tone.AMSynth().toMaster();

  //transport initializations
  Tone.Transport.loopEnd = '1m'
  Tone.Transport.loop = true;
  for (let i = 0; i < 12 * melodySpeed; i++) {
    Tone.Transport.schedule(triggerSynthA, i * (60 / melodySpeed) / Tone.Transport.bpm.value)
  }

  for (let i = 0; i < 12 * bassSpeed; i++) {
    Tone.Transport.schedule(triggerSynthB, i * (60 / bassSpeed) / Tone.Transport.bpm.value)
  }

  //   offlineRenderer = new Tone.OfflineContext(2, 44100*60/Tone.Transport.bpm.value, 44100)
  // 	recorder = new MediaRecorder()

  //   recorderbutton = createRecorderButton('record')
  // 	recorderbutton.mouseClicked(() => {
  //   	recorder.start(40);
  //   })
}

//===========================================================\\

//array shuffler
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function touchStarted() {
  if (Tone.context.state !== 'running') {
    Tone.context.resume()
  }
}

//define synth notes
function triggerSynthA(time) {
  synthA.triggerAttackRelease(midiToFreq(melArr[synthAcounter % 12] + 60), '32n', time)
  synthAcounter++;

}

function triggerSynthB(time) {
  synthB.triggerAttackRelease(midiToFreq(basArr[synthBcounter % 12] + 48), '32n', time)
  synthBcounter++;
}

function setMelodyBassType() {
  if (melodyType === 'retrograde') {
    melArr = twelveToneArr.slice().reverse();
  } else if (melodyType === 'inversion') {
    melArr = twelveToneArr.map(x => (12 - x) % 12)
  } else if (melodyType === 'retrograde inversion') {
    melArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
  }

  if (bassType === 'retrograde') {
    basArr = twelveToneArr.slice().reverse();
  } else if (bassType === 'inversion') {
    basArr = twelveToneArr.map(x => (12 - x) % 12)
  } else if (bassType === 'retrograde inversion') {
    basArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
  }
}


function gotData(file) {
  json = loadJSON(file.data, buildSettings)
  console.log(loadJSON(file.data))
  // buildSettings()
}

function buildSettings() {
  Tone.Transport.bpm.value = json.tempo;
  bpmInput.value(json.tempo);

  twelveToneArr = json.tonerow
  for (let i = 0; i < 12; i++) {
    toneDropdowns[i].value(twelveToneArr[i]);
  }

  if (json.melodyRhythm === 'slow') {
    melodySpeed = 1;
    melRhythmArr = notComplex
  } else if (json.melodyRhythm === 'medium') {
    melodySpeed = 2;
    melRhythmArr = notComplex
  } else if (json.melodyRhythm === 'fast') {
    melodySpeed = 3;
    melRhythmArr = notComplex
  } else if (json.melodyRhythm === 'complex') {
    melodySpeed = 1;
    melRhythmArr = melComplex
  }
  melodyRhythmDropdown.value(json.melodyRhythm)

  if (json.bassRhythm === 'slow') {
    bassSpeed = 1;
    basRhythmArr = notComplex
  } else if (json.bassRhythm === 'medium') {
    bassSpeed = 2;
    basRhythmArr = notComplex
  } else if (json.bassRhythm === 'fast') {
    bassSpeed = 3;
    basRhythmArr = notComplex
  } else if (json.bassRhythm === 'complex') {
    bassSpeed = 1;
    basRhythmArr = basComplex
  }
  bassRhythmDropdown.value(json.bassRhythm)

  if (json.melodySetForm === 'retrograde') {
    melodyType = 'retrograde';
    melArr = twelveToneArr.slice().reverse();
  } else if (json.melodySetForm === 'inversion') {
    melodyType = 'inversion';
    melArr = twelveToneArr.map(x => (12 - x) % 12)
  } else if (json.melodySetForm === 'retrograde inversion') {
    melodyType = 'retrograde inversion';
    melArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
  } else if (json.melodySetForm === 'prime') {
    melodyType = 'prime';
    melArr = twelveToneArr;
  }
  melodyRow.html('melody: ' + melArr)
  melodySetFormDropdown.value(json.melodySetForm)

  if (json.bassSetForm === 'retrograde') {
    bassType = 'retrograde';
    basArr = twelveToneArr.slice().reverse();
  } else if (json.bassSetForm === 'inversion') {
    bassType = 'inversion';
    basArr = twelveToneArr.map(x => (12 - x) % 12)
  } else if (json.bassSetForm === 'retrograde inversion') {
    bassType = 'retrograde inversion';
    basArr = twelveToneArr.slice().reverse().map(x => (12 - x) % 12);
  } else if (json.bassSetForm === 'prime') {
    bassType = 'prime';
    basArr = twelveToneArr;
  }
  bassRow.html('bass: ' + basArr);
  bassSetFormDropdown.value(json.bassSetForm)

  synthA.dispose();
  if (json.melodySynth === 'AMSynth') {
    synthA = new Tone.AMSynth().toMaster();
  } else if (json.melodySynth === 'FMSynth') {
    synthA = new Tone.FMSynth().toMaster();
  } else if (json.melodySynth === 'PluckSynth') {
    synthA = new Tone.PluckSynth().toMaster();
  } else if (json.melodySynth === 'Sine') {
    synthA = new Tone.Synth({
      "oscillator": {
        "type": "sine"
      }
    }).toMaster();
  } else if (json.melodySynth === 'Triangle') {
    synthA = new Tone.Synth({
      "oscillator": {
        "type": "triangle"
      }
    }).toMaster();
  } else if (json.melodySynth === 'Square') {
    synthA = new Tone.Synth({
      "oscillator": {
        "type": "square"
      }
    }).toMaster();
  } else if (json.melodySynth === 'Sawtooth') {
    synthA = new Tone.Synth({
      "oscillator": {
        "type": "sawtooth"
      }
    }).toMaster();
  }
  melSynthButton.value(json.melodySynth)

  synthB.dispose()
  if (json.bassSynth === 'AMSynth') {
    synthB = new Tone.AMSynth().toMaster();
  } else if (json.bassSynth === 'FMSynth') {
    synthB = new Tone.FMSynth().toMaster();
  } else if (json.bassSynth === 'PluckSynth') {
    synthB = new Tone.PluckSynth().toMaster();
  } else if (json.bassSynth === 'Sine') {
    synthB = new Tone.Synth({
      "oscillator": {
        "type": "sine"
      }
    }).toMaster();
  } else if (json.bassSynth === 'Triangle') {
    synthB = new Tone.Synth({
      "oscillator": {
        "type": "triangle"
      }
    }).toMaster();
  } else if (json.bassSynth === 'Square') {
    synthB = new Tone.Synth({
      "oscillator": {
        "type": "square"
      }
    }).toMaster();
  } else if (json.bassSynth === 'Sawtooth') {
    synthB = new Tone.Synth({
      "oscillator": {
        "type": "sawtooth"
      }
    }).toMaster();
  }

  basSynthButton.value(json.bassSynth)
  synthA.volume.value = json.melodyVolume
  synthAVolSlider.value(json.melodyVolume)
  synthB.volume.value = json.bassVolume
  synthBVolSlider.value(json.bassVolume)

  Tone.Transport.cancel(0);
  for (let i = 0; i < 12 * melodySpeed; i++) {
    Tone.Transport.schedule(triggerSynthA, (i + melRhythmArr[i]) * (60 / melodySpeed) / Tone.Transport.bpm.value)
  }
  for (let i = 0; i < 12 * bassSpeed; i++) {
    Tone.Transport.schedule(triggerSynthB, (i + basRhythmArr[i]) * (60 / bassSpeed) / Tone.Transport.bpm.value)
  }
}