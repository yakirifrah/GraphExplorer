export   function getNodeColor(label?: string) {
  switch (label) {
    case 'Movie':
      return '#e91e63';
    case 'Person':
      return '#2196f3';
    case 'Genre':
      return '#4caf50';
    default:
      return '#9c27b0';
  }
}
