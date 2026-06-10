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

export function mapReviver(key, value) {
  if (value && typeof value === 'object' && value.dataType === 'Map') {
    return new Map(Object.entries(value.map));
  }
  return value;
}