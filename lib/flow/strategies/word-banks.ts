// Filler content banks for the Grid component's "random" fill strategies.
// Order is fixed (no Math.random) so a given experience renders identically
// for every viewer of the same link.

export const NAME_BANK = [
  "Olivia", "Liam", "Emma", "Noah", "Ava", "Oliver", "Sophia", "Elijah",
  "Isabella", "Lucas", "Mia", "Mason", "Amelia", "Ethan", "Harper", "Logan",
  "Evelyn", "James", "Luna", "Benjamin", "Camila", "Jacob", "Gianna", "Michael",
  "Elizabeth", "Alexander", "Eleanor", "Daniel", "Ella", "Henry", "Abigail", "Jackson",
  "Sofia", "Sebastian", "Avery", "Aiden", "Scarlett", "Matthew", "Emily", "Samuel",
  "Aria", "David", "Penelope", "Joseph", "Chloe", "Carter", "Layla", "Owen",
  "Riley", "Wyatt", "Zoey", "John", "Nora", "Jack", "Lily", "Luke",
  "Eliana", "Jayden", "Hannah", "Dylan", "Lillian", "Grayson", "Addison", "Levi",
  "Aubrey", "Isaac", "Ellie", "Gabriel", "Stella", "Julian", "Natalie", "Mateo",
  "Zoe", "Anthony", "Leah", "Jaxon", "Hazel", "Lincoln", "Violet", "Joshua",
  "Aurora", "Christopher", "Savannah", "Andrew", "Audrey", "Theodore", "Brooklyn", "Caleb",
  "Bella", "Ryan", "Claire", "Asher", "Skylar", "Nathan", "Lucy", "Adrian",
];

export const WORD_BANK = [
  "Spark", "Drift", "Glow", "Wander", "Bloom", "Ember", "Echo", "Hollow",
  "Ridge", "Meadow", "Tide", "Grove", "Haven", "Willow", "Crest", "Dune",
  "Horizon", "Lantern", "Orbit", "Prairie", "Quartz", "Ripple", "Summit", "Thicket",
  "Valley", "Whisper", "Zephyr", "Amber", "Birch", "Cove", "Delta", "Ferndale",
  "Granite", "Harbor", "Isle", "Juniper", "Kindle", "Lagoon", "Mirage", "Nectar",
  "Opal", "Pinnacle", "Quill", "Reverie", "Sable", "Timber", "Umbra", "Verve",
];

export function cycle(bank: string[], count: number): string[] {
  return Array.from({ length: count }, (_, i) => bank[i % bank.length]);
}
