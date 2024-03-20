export function parseMongoError(error: any) {
  if (error.code === 11000) {
    // Find the `dup key` part of the error message
    const dupKeyPart = error.message.match(/dup key: { (.+): "(.+)" }/);

    if (dupKeyPart && dupKeyPart.length === 3) {
      // Extract the field and value causing the duplication
      const field = dupKeyPart[1];
      const value = dupKeyPart[2];
      return { field, value };
    }
  }
  return null;
}
