


const allPostReducer = (
  state = { allPosts: null, loading: false, error: false, },
  action
) => {
  switch (action.type) {
    // belongs to PostShare.jsx
    case "ALL_POST_LOADING":
      return { ...state, allPosts: null, error: false, loading: true };
    case "ALL_POST_SUCCESS":
      return { ...state, allPosts: action.payload, loading: false, error: false };
    case "ALL_POST_FAIL":
      return { ...state, loading: false, error: true };

    default:
      return state;
  }
};

export default allPostReducer;
