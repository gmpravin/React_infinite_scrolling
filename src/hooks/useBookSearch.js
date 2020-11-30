import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";

export default function useBookSearch(query, pageNo) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    let cancel;
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNo },
      cancelToken: new axios.CancelToken((c) => (cancel = c))
    })
      .then((res) => {
        setBooks((prevBook) => {
          return _.uniqBy(
            [
              ...prevBook,
              ...res.data.docs.map((b) => ({
                title: b.title,
                publish_year: b.first_publish_year,
                key:b.key,
              }))
            ],
            "title"
          );
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
        return () => cancel();
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
  }, [query, pageNo]);

  return { loading, error, books, hasMore };
}
