import {Composition,Folder} from 'remotion';
import {Film} from './Film';
export const Root=()=> <>
 <Composition id="EtqanCinematic3D60s" component={Film} durationInFrames={1800} width={1080} height={1920} fps={30} defaultProps={{offset:0,audio:true}}/>
 <Folder name="3D-Scenes">
 <Composition id="Earth" component={Film} durationInFrames={240} width={1080} height={1920} fps={30} defaultProps={{offset:0,audio:false}}/>
 <Composition id="Riyadh" component={Film} durationInFrames={300} width={1080} height={1920} fps={30} defaultProps={{offset:240,audio:false}}/>
 <Composition id="Laboratory" component={Film} durationInFrames={210} width={1080} height={1920} fps={30} defaultProps={{offset:540,audio:false}}/>
 <Composition id="Soil" component={Film} durationInFrames={300} width={1080} height={1920} fps={30} defaultProps={{offset:750,audio:false}}/>
 <Composition id="Concrete" component={Film} durationInFrames={300} width={1080} height={1920} fps={30} defaultProps={{offset:1050,audio:false}}/>
 <Composition id="Asphalt" component={Film} durationInFrames={240} width={1080} height={1920} fps={30} defaultProps={{offset:1350,audio:false}}/>
 <Composition id="Confidence" component={Film} durationInFrames={120} width={1080} height={1920} fps={30} defaultProps={{offset:1590,audio:false}}/>
 <Composition id="Brand" component={Film} durationInFrames={90} width={1080} height={1920} fps={30} defaultProps={{offset:1710,audio:false}}/>
 </Folder>
 </>;
