import React from 'react';

function SelectCount({ count, item, decreaseCount, increaseCount, onChangeCount }) {
    const onHandelDecreaseCount = () => {
        if (count > 1) {
            decreaseCount(item)
        }
    }

    const onHandelIncreaseCount = () => {
        if (count < 20) {
            increaseCount(item)
        }
    }

    const onHandleChangeCount = (e) => {
        const value = e.target.value
        if (!Number.isNaN(value) && Number(value) > 0 && Number(value) < 21) {
            onChangeCount(value, item);
        }
    }

    return (
        <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn change-count" onClick={onHandelDecreaseCount}>-</button>
            <input className="input-number text-center count" value={count} onChange={onHandleChangeCount} type="text" />
            <button type="button" className="btn change-count" onClick={onHandelIncreaseCount}>+</button>
        </div>
    );
}

export default SelectCount;