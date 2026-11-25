import {Routes,Route} from 'react-router-dom';
import {PublicLayout,AppLayout,Guard,Home,About,Resources,Login,Register,NotFound,Dashboard,Lesson,Translator,Dictionary,Communicate,Emergency,Scenarios,Scenario,Practice,DailyTest,Result,Revision,Progress,Planner,Library,Profile,Settings} from './pages.jsx';
import {LearnHub,TrackHub,Categories,Topic,Match,Instructions,Review,Stats,Notifications,FAQPage,Contact} from './more.jsx';
import {PopupHost} from './popups.jsx';
import {Explore,Challenge,Leaderboard,Flashcards,Feedback,Checkin,Certificate,Stories} from './extras.jsx';
import {AdminLayout,AdminHome,AdminSection} from './admin.jsx';
const R=(p,e)=><Route path={p} element={e}/>;
export default function App(){return <><PopupHost/><Routes>
 <Route element={<PublicLayout/>}><Route index element={<Home/>}/>{R('about',<About/>)}{R('awareness',<Resources/>)}{R('resources',<Resources/>)}{R('faq',<FAQPage/>)}{R('contact',<Contact/>)}{R('login',<Login/>)}{R('register',<Register/>)}</Route>
 <Route path="app" element={<Guard><AppLayout/></Guard>}><Route index element={<Dashboard/>}/>
  {R('learn',<LearnHub/>)}{R('learn/:id',<Lesson/>)}{R('track/:track',<TrackHub/>)}{R('topic/:key',<Topic/>)}{R('categories',<Categories/>)}
  {R('translator',<Translator/>)}{R('translator/text-to-braille',<Translator start="t2b"/>)}{R('translator/braille-to-text',<Translator start="b2t"/>)}
  {R('dictionary',<Dictionary/>)}{R('accessibility-dictionary',<Dictionary/>)}{R('communicate',<Communicate/>)}{R('text-to-speech',<Communicate/>)}
  {R('translation-history',<Library start="History"/>)}{R('favorite-translations',<Library start="Favorites"/>)}
  {R('emergency',<Emergency/>)}{R('scenarios',<Scenarios/>)}{R('scenarios/:id',<Scenario/>)}
  {R('practice',<Practice/>)}{R('practice/matching',<Match/>)}{R('practice/:mode',<Practice/>)}
  {R('test/instructions',<Instructions/>)}{R('test',<DailyTest/>)}{R('result',<Result/>)}{R('review',<Review/>)}{R('revision',<Revision/>)}{R('recommended-revision',<Revision/>)}
  {R('progress',<Progress/>)}{R('stats/:view',<Stats/>)}{R('planner',<Planner/>)}{R('goals',<Planner/>)}
  {R('library',<Library/>)}{R('favorites',<Library start="Favorites"/>)}{R('activity',<Library start="History"/>)}{R('notifications',<Notifications/>)}
  {R('explore',<Explore/>)}{R('challenge',<Challenge/>)}{R('leaderboard',<Leaderboard/>)}{R('flashcards',<Flashcards/>)}{R('feedback',<Feedback/>)}{R('checkin',<Checkin/>)}{R('certificate',<Certificate/>)}{R('stories',<Stories/>)}{R('profile',<Profile/>)}{R('settings',<Settings/>)}{R('accessibility-settings',<Settings/>)}</Route>
 <Route path="admin" element={<Guard role="admin"><AdminLayout/></Guard>}><Route index element={<AdminHome/>}/>{R(':section',<AdminSection/>)}</Route>
 <Route path="*" element={<NotFound/>}/></Routes></>}
