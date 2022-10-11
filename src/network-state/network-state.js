function NetworkState({ onNetworkState }) {
  window.addEventListener('offline', () => {
    onNetworkState();
  });

  window.addEventListener('online', () => {
    onNetworkState();
  });
}

export default NetworkState;
