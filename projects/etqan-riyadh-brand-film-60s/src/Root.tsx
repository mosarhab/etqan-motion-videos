import {Composition,Folder} from 'remotion';
import {Film} from './Film';
import {GlobeScene} from './scenes/GlobeScene';
import {ArrivalScene} from './scenes/ArrivalScene';
import {JourneyScene} from './scenes/JourneyScene';
import {SoilScene} from './scenes/SoilScene';
import {ConcreteScene} from './scenes/ConcreteScene';
import {AsphaltScene} from './scenes/AsphaltScene';
import {ResultsScene} from './scenes/ResultsScene';
import {OutroScene} from './scenes/OutroScene';
export const RemotionRoot=()=> <>
 <Composition id="EtqanRiyadhBrandFilm60s" component={Film} durationInFrames={1800} width={1080} height={1920} fps={30}/>
 <Folder name="Scenes">
 <Composition id="Globe" component={GlobeScene} durationInFrames={210} width={1080} height={1920} fps={30}/>
 <Composition id="Arrival" component={ArrivalScene} durationInFrames={300} width={1080} height={1920} fps={30}/>
 <Composition id="Journey" component={JourneyScene} durationInFrames={240} width={1080} height={1920} fps={30}/>
 <Composition id="Soil" component={SoilScene} durationInFrames={270} width={1080} height={1920} fps={30}/>
 <Composition id="Concrete" component={ConcreteScene} durationInFrames={270} width={1080} height={1920} fps={30}/>
 <Composition id="Asphalt" component={AsphaltScene} durationInFrames={240} width={1080} height={1920} fps={30}/>
 <Composition id="Results" component={ResultsScene} durationInFrames={150} width={1080} height={1920} fps={30}/>
 <Composition id="Outro" component={OutroScene} durationInFrames={120} width={1080} height={1920} fps={30}/>
 </Folder>
 </>;
