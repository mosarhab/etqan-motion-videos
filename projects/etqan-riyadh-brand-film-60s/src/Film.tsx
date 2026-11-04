import {AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {GlobeScene} from './scenes/GlobeScene';
import {ArrivalScene} from './scenes/ArrivalScene';
import {JourneyScene} from './scenes/JourneyScene';
import {SoilScene} from './scenes/SoilScene';
import {ConcreteScene} from './scenes/ConcreteScene';
import {AsphaltScene} from './scenes/AsphaltScene';
import {ResultsScene} from './scenes/ResultsScene';
import {OutroScene} from './scenes/OutroScene';
import {C,Svg} from './design';
const EngineeringSeam=()=>{const f=useCurrentFrame();const {durationInFrames}=useVideoConfig();const p=f/(durationInFrames-1);return <Svg><defs><linearGradient id="seam"><stop stopColor={C.yellow} stopOpacity="0"/><stop offset=".5" stopColor={C.yellow} stopOpacity=".16"/><stop offset="1" stopColor={C.yellow} stopOpacity="0"/></linearGradient></defs><g transform={`translate(${-1700+3800*p} 0) skewX(-18)`}><rect width="600" height="1920" fill="url(#seam)"/><path d="M300 0V1920" stroke={C.yellow} strokeWidth="3" opacity={Math.sin(p*Math.PI)}/></g></Svg>};
export const Film=()=>{const {fps}=useVideoConfig();return <AbsoluteFill>
 <TransitionSeries>
  <TransitionSeries.Sequence name="01 · المملكة" durationInFrames={7*fps} premountFor={fps}><GlobeScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="02 · الموقع الدقيق" durationInFrames={10*fps} premountFor={fps}><ArrivalScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="03 · رحلة العينة" durationInFrames={8*fps} premountFor={fps}><JourneyScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="04 · التربة" durationInFrames={9*fps} premountFor={fps}><SoilScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="05 · الخرسانة" durationInFrames={9*fps} premountFor={fps}><ConcreteScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="06 · الأسفلت والمواد" durationInFrames={8*fps} premountFor={fps}><AsphaltScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="07 · النتائج" durationInFrames={5*fps} premountFor={fps}><ResultsScene/></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={22} premountFor={fps}><EngineeringSeam/></TransitionSeries.Overlay>
  <TransitionSeries.Sequence name="08 · العلامة" durationInFrames={4*fps} premountFor={fps}><OutroScene/></TransitionSeries.Sequence>
 </TransitionSeries>
 <Audio src={staticFile('assets/original-score.wav')} volume={0.75} premountFor={fps}/>
 </AbsoluteFill>};
