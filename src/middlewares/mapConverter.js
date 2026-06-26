// Converts a map into an object with a datatype signifing it is a map (used to send maps through JSON)
export function mapReplacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      map: Object.fromEntries(value),
    };
  } else {
    return value;
  }
}

// Converts an object into a map this only triggers if it has a datatype signifing that it is a map (used to recieve maps from JSON)
export function mapReviver(key, value) {
  if (value && typeof value === 'object' && value.dataType === 'Map') {
    return new Map(Object.entries(value.map));
  }
  return value;
}