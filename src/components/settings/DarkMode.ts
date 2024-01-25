import { useEffect } from 'react';
import { setDarkMode, selectDarkMode } from './darkModeSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

function DarkMode() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectDarkMode);

  useEffect(() => {
    // Check if dark mode is enabled in local storage
    const darkmode = localStorage.getItem('darkmode');
    if (darkmode === 'true') {
      // Dispatch action to set dark mode
      dispatch(setDarkMode(true));
    }

  }, [dispatch]); // Include dispatch in the dependency array to satisfy the eslint rule

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return null;
}

export default DarkMode;
