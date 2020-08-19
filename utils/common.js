const compareAndFindWithUUID = (currentList, dbList) => {
  try {
    let updateList = [];
    let createList = [];
    let deleteList = [];

    currentList.map((item) => {
      const check = dbList.find((dbItem) => item.uuid === dbItem.uuid);

      if (check) {
        updateList = [...updateList, item];
      } else {
        // Get Add List
        createList = [...createList, item];
      }
    });

    // Delete List
    dbList.map((dbItem) => {
      const status = currentList.find((item) => item.uuid === dbItem.uuid);
      if (!status) deleteList = [...deleteList, dbItem];
    });

    return { createList, updateList, deleteList };
  } catch (err) {
    console.log(err);
  }
};

const compareAndFindWithID = (currentList, dbList) => {
  try {
    let updateList = [];
    let createList = [];
    let deleteList = [];

    currentList.map((item) => {
      const check = dbList.find((dbItem) => item.id === dbItem.id);
      if (check) {
        updateList = [...updateList, item];
      } else if (!item.id) {
        createList = [...createList, item];
      }
    });

    // Delete List
    dbList.map((dbItem) => {
      const status = currentList.find((item) => item.id === dbItem.id);
      if (!status) deleteList = [...deleteList, dbItem];
    });

    return { createList, updateList, deleteList };
  } catch (err) {
    console.log(err);
  }
};

const getUserFirstName = (name) => {
  return name.split(" ")[0];
};

const updateQueryGenerator = (body, query) => {
  try {
    const keys = Object.keys(body);
    keys.map((key, index) => {
      query.sql += ` ${key} = ?${index + 1 < keys.length ? "," : ""}`;
      query.values.push(body[key]);
    });
    return query;
  } catch (err) {
    console.log("updateQueryGeneratorErr ", err);
  }
};

module.exports = {
  compareAndFindWithUUID,
  compareAndFindWithID,
  getUserFirstName,
  updateQueryGenerator,
};
