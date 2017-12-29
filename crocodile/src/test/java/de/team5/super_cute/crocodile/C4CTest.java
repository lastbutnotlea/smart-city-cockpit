package de.team5.super_cute.crocodile;

import de.team5.super_cute.crocodile.external.SAPC4CConnector;
import de.team5.super_cute.crocodile.model.C4CEntity;
import de.team5.super_cute.crocodile.model.Event;
import de.team5.super_cute.crocodile.model.ServiceRequest;
import java.io.IOException;
import java.util.List;
import org.apache.olingo.odata2.api.batch.BatchException;
import org.apache.olingo.odata2.api.edm.EdmException;
import org.apache.olingo.odata2.api.ep.EntityProviderException;
import org.junit.Assert;
import org.junit.Test;

public class C4CTest {

  @Test
  public void testAppointments() {
    testC4CEntity(new Event(Double.toHexString((int)(Math.random() * 10000)), false,
        "This is an Appointment for our automated Tests :)"));
  }

  @Test
  public void testServiceRequests() {
    testC4CEntity(new ServiceRequest(Double.toHexString((int)(Math.random() * 10000)), "TestVehicleId", "TestPriority"));
  }

  private void testC4CEntity(C4CEntity entity) {
    try {
      SAPC4CConnector connector = new SAPC4CConnector();
      if (connector.getC4CEntities(entity.getEmptyObject()).contains(entity)) {
        Assert.fail("Test " + entity.getClass() + "\n" + entity + "\n is already present in " + entity.getCollectionName());
      }
      connector.putC4CEntity(entity);
      Assert.assertTrue(connector.getC4CEntities(entity.getEmptyObject()).contains(entity));

      List<C4CEntity> objects = connector.getC4CEntities(entity.getEmptyObject());
      C4CEntity entityWithObjectId = objects.get(objects.indexOf(entity));
      connector.deleteC4CEntity(entityWithObjectId);

    } catch (EntityProviderException | IOException | BatchException | EdmException e) {
      e.printStackTrace();
      Assert.fail("Exception was thrown: " + e.getMessage());
    }
  }

}
