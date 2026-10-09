import house from '@/assets/house-cables.jpg';
import copper from '@/assets/copper-cable.jpg';
import power from '@/assets/power-cables.jpg';
import factory from '@/assets/factory-hero.jpg';
export { factory };
export const companyStory = 'Bracon Wire & Cable is a wholly owned Nigerian company incorporated in April 1998 to manufacture wire and cable products in Nigeria. Our manufacturing facilities were commissioned in May 1999. Production of house wiring cables for conduit and surface wiring commenced immediately after commissioning. Many other products have since been added to our product lines, and we have established a distribution network throughout Nigeria.';
export const products = [
 { slug:'house-wire-cables', name:'House Wire Cables', category:'Residential', image:house, description:'Reliable connections for conduit and surface wiring in homes and buildings.', spec:'House wiring cables for conduit and surface wiring.', sizes:[] as number[], note:'Contact our team for available sizes and specifications.' },
 { slug:'earth-copper-wires', name:'Earth Copper Wires', category:'Earthing', image:copper, description:'Copper conductors for dependable earthing and electrical installations.', spec:'Earth Copper Cable', sizes:[10,16,25,35,50,70,95,120,150,185,240,300,400,500,630], note:'Sold in metres, drum packed.' },
 { slug:'power-control-cables', name:'Power & Control Cables', category:'Industrial', image:power, description:'Built for power distribution and control applications across industries.', spec:'Power and control cables', sizes:[] as number[], note:'Contact our team for conductor, core and finish specifications.' },
 { slug:'service-entrance-cables', name:'Service Entrance Cables', category:'Distribution', image:power, description:'Aluminium single-core cables for service entrance connections.', spec:'Aluminium Single Core PVC Insulated Non Sheathed', sizes:[6,10,16,25,35], note:'Each size × 1 core.' },
 { slug:'retilens-cables', name:'Retilens Cables', category:'Distribution', image:power, description:'Black PVC-insulated aluminium conductors for your installation needs.', spec:'Aluminium Single Core PVC Insulated Non Sheathed Black', sizes:[16,25,35,50,70,95,120,150,185], note:'Normally sold in 4-core twisted configuration.' },
 { slug:'overhead-aluminium-cables', name:'Bare Overhead Aluminium Cables', category:'Distribution', image:copper, description:'Aluminium conductors for overhead electricity distribution.', spec:'Bare Overhead Aluminium Cables', sizes:[] as number[], note:'Request the current specification sheet from our technical team.' },
];
export const faqs = [
 ['Where is Bracon located?', 'Our address is KM 34, Lagos Abeokuta Express Way, Amje Alakuko, Nigeria.'],
 ['Can I order cables to my own specification?', 'Yes. Wires and cables can be made to client specifications based on the product. Our manufacturers can guide you on voltage, conductor size, number of cores, conductor material, armoured or unarmoured finish, cable length and individual drum length.'],
 ['How do I get a quotation?', 'Submit a quote request with the product, quantity or length and your project requirements. You can also email sales@braconwire.com or call +2348050925884. Prices are confirmed by our sales team.'],
 ['Which sizes of earth copper cable are available?', 'The supplied product range includes 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500 and 630 mm². Sold in metres, drum packed.'],
 ['Do you offer wooden drums and cable rewinding?', 'Yes. Bracon produces hardwood drums to support heavy-duty cables during storage and transfers. We also offer rewinding of broken-drum cables using a mobile heavy-duty cable rewinder.'],
 ['How can I become a distributor?', 'Send a distributor enquiry with your name, email, phone number and location. Our team will discuss opportunities in our Nigerian distribution network.'],
];
export function pageHead(title:string,description:string) { return { meta:[{title:`${title} — Bracon Wire & Cable`},{name:'description',content:description},{property:'og:title',content:`${title} — Bracon Wire & Cable`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}] }; }
