/* Site content (timeline, gallery, M4 generations). "TBD" = not verified yet. Models are in models.js, image URLs in images.js. */
const TIMELINE=[
{y:"1916",t:"BMW is founded",x:"Bayerische Flugzeug-Werke, rooted in Rapp Motorenwerke, builds aircraft engines in Munich."},
{y:"1917",t:"Bayerische Motoren Werke",x:"The company takes the BMW name and the blue-and-white roundel."},
{y:"1923",t:"BMW R32",x:"The first BMW motorcycle, designed by Max Friz."},
{y:"1928",t:"First BMW cars",x:"Acquiring Fahrzeugfabrik Eisenach begins BMW car production with the Dixi-based 3/15."},
{y:"1936",t:"328 Roadster",x:"A light, successful sports car that dominated racing in the late 1930s."},
{y:"1972",t:"BMW Motorsport GmbH",x:"The company that became BMW M is founded; the 3.0 CSL carries it into touring-car racing."},
{y:"1978",t:"BMW M1",x:"The mid-engine supercar and the basis of the Procar race series."},
{y:"1986",t:"E30 M3",x:"The first M3 arrives as a homologation special for touring-car racing."},
{y:"2014",t:"F82 M4",x:"The M4 name debuts when the 4 Series coupe splits from the 3 Series sedan."},
{y:"2021",t:"G82 M4",x:"Second-generation M4 with the S58 twin-turbo inline-six."}
];
const LOGOS=[["1917","Original roundel with the Bavarian colours."],["1997","Three-dimensional chrome look."],["2020","Flat, transparent logo for digital use."],["Between","Other redesigns: TBD"]];
const GALLERY=[
{k:"hero",t:"M4 Competition, matte black",c:["Modern","M Series"]},
{k:"m4-night",t:"M4 at night",c:["Modern","M Series"]},
{k:"m4-garage",t:"M4 in the garage",c:["Modern","M Series"]},
{k:"m5cs",t:"M5 CS",c:["Modern","M Series"]},
{k:"g70",t:"760i xDrive",c:["Modern"]},
{k:"i8",t:"i8 Roadster",c:["Modern"]},
{k:"csl-pair",t:"3.0 CSL and 2002 Turbo",c:["Classic","Motorsport"]},
{k:"e30-m3",t:"E30 M3",c:["Classic","M Series"]},
{k:"m1",t:"M1 Procar",c:["Classic","Motorsport"]},
{k:"z8",t:"Z8",c:["Classic"]},
{k:"t2002",t:"2002 Turbo",c:["Classic"]},
{k:"m4-gt3",t:"M4 GT3 at night",c:["Motorsport","M Series"]},
{k:"wheel",t:"M steering wheel",c:["Details"]},
{k:"carbon",t:"Carbon roof detail",c:["Details"]},
{k:"brakes",t:"Carbon-ceramic brakes",c:["Details"]},
{k:"exhaust",t:"Exhaust and diffuser",c:["Details"]}
];
const GAL_CATS=["All","Classic","Modern","M Series","Motorsport","Details"];
const M4_GENS=[["E92 M3","2007–2013","4.0L V8 (S65). The M3 coupe that preceded the M4 name."],["F82 M4","2014–2020","3.0L twin-turbo I6 (S55). First car to carry the M4 name."],["G82 M4","2021–","3.0L twin-turbo I6 (S58). 503 hp in Competition trim."]];
