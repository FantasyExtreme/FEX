import { Points } from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';
import logger from '@/lib/logger';
import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
function PointsEditor({ points, actor }: { points: Points; actor: any }) {
  const [editing, setEditing] = useState(false);
  const [editedPoints, setEditedPoints] = useState<Points>(points);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key1: keyof Points,
    key2: keyof Points,
  ) => {
    const { value } = event.target;
    setEditedPoints((prevPoints) => ({
      ...prevPoints,
      [key1]: {
        ...prevPoints[key1],
        [key2]: Number(value),
      },
    }));
  };

  const handleSave = async () => {
    try {
      setEditing(true);
      let _ = await actor.updateStatsSysteam(editedPoints);
      toast.success('Updated Stats Points');
    } catch (error) {
      toast.error('Error updating stats points');
    }
    setEditing(false);
  };

  return (
    <div>
      <form className='stats-form'>
        {Object.entries(points).map(([key1, value]) =>
          Object.entries(value).map(([key2, nestedValue]) => (
            <label key={key2}>
              {key2}:
              <input
                type='number'
                className='form-control'
                value={Number(
                  // @ts-ignore
                  editedPoints[key1 as keyof Points][key2 as keyof Points],
                )}
                onChange={(event) => {
                  handleInputChange(
                    event,
                    key1 as keyof Points,
                    key2 as keyof Points,
                  );
                }}
              />
            </label>
          )),
        )}
        <Button
          className='reg-btn trans-white mid text-capitalize mx-3'
          disabled={editing}
          onClick={handleSave}
          id='handlesave_btn'
        >
          {editing ? <Spinner size='sm' /> : 'Save'}
        </Button>
      </form>
    </div>
  );
}

export default PointsEditor;
